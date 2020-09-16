module Jekyll
  module Converters
    module StretcherExtensions
      class StretcherImporter < SassC::Importer
        def sretcher_mixin()
          <<-GOOSE
// START INJECTED STRETCHER
$stretcher-min: 375px !default;
$stretcher-max: 1440px !default;

@mixin jekyll-stretcher-double-scale($properties, $min-value, $max-value) {
  @each $property in $properties {
    \#{$property}: $min-value;
  }

  @media (min-width: $stretcher-min) {
    @each $property in $properties {
      \#{$property}: calc(\#{$min-value} + \#{strip-unit($max-value - $min-value)} * (100vw - \#{$stretcher-min}) / \#{strip-unit($stretcher-max - $stretcher-min)});
    }
  }

  @media (min-width: $stretcher-max) {
    @each $property in $properties {
      \#{$property}: $max-value;
    }
  }
}

@function strip-unit($number) {
  @if type-of($number) == \"number\" and not unitless($number) {
    @return $number / ($number * 0 + 1);
  }

  @return $number;
}
// END INJECTED STRETCHER
GOOSE
        end

        def stretcher_rewrite(file)
          matched = false
          lines = file.lines.map(&:chomp)

          lines.each_with_index do |l, i|
            next unless l =~ /->/
            values = l.match(/^(\s*)([a-z-]+):\s*(\d+|\.\d+|\d+\.\d+)(cm|mm|in|px|pt|pc|em|ex|ch|rem|%|vw|vh|vmin|vmax)\s*->\s*(\d+|\.\d+|\d+\.\d+)(cm|mm|in|px|pt|pc|em|ex|ch|rem|%|vw|vh|vmin|vmax)\s*;/)
            next unless values
            indentation, declaration, minVal, minUnit, maxVal, maxUnit = values.captures

            warning = ""
            if minUnit != maxUnit
              warning += "#{indentation}@error \"Stretcher mixin units don't match; '#{minVal}#{minUnit} -> #{maxVal}#{maxUnit}': #{minUnit} !== #{maxUnit}\";\n"
            end
            if minUnit =~ /%|vw|vh|vmin|vmax/
          warning += "#{indentation}@warn \"Relative units may not work with the scaling mixin (#{minUnit})\";\n";
            end

            lines[i] = "#{warning}#{indentation}@include jekyll-stretcher-double-scale(#{declaration}, #{minVal}#{minUnit}, #{maxVal}#{maxUnit});";
            matched = true
          end
          lines.unshift(sretcher_mixin) if matched
          lines.join("\n")
        end

        def imports(path, parent_path)
          root = Pathname.new parent_path
          file = Pathname.new path

          if file.extname.empty?
            file = Pathname.new path + ".scss"
          end

          if root.absolute?
            relative = root.dirname.join(file) 
          else
            options[:load_paths].each do |p|
              p = Pathname.new p
              relative = p.join(file)
              break if relative.exist?
              relative = nil
            end
          end

          if relative.empty?
            Import.new(path)
            return
          end

          stretched_source = stretcher_rewrite relative.read

          Import.new(path, source: stretched_source)
          
        end
      end


      def sass_configs
        sass_build_configuration_options(
          :style                => sass_style,
          :syntax               => syntax,
          :filename             => filename,
          :output_path          => output_path,
          :source_map_file      => source_map_file,
          :load_paths           => sass_load_paths,
          :importer             => StretcherImporter,
          :omit_source_map_url  => !sourcemap_required?,
          :source_map_contents  => true,
          :line_comments_option => line_comments_option
        )
      end
    end
    class Scss < Converter
      prepend StretcherExtensions
    end
  end
end
