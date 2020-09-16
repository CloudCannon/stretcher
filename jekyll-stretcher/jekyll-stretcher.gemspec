# frozen_string_literal: true

$LOAD_PATH.unshift File.expand_path("lib", __dir__)
require "jekyll-stretcher/version"

Gem::Specification.new do |s|
  s.name          = "jekyll-stretcher"
  s.version       = JekyllStretcher::VERSION
  s.authors       = ["Liam Bigelow"]
  s.email         = ["liam@cloudcannon.com"]
  s.homepage      = "https://github.com/cloudcannon/stretcher"
  s.summary       = "A Jekyll plugin to handle stretcher SCSS syntax"

  s.files         = `git ls-files app lib`.split("\n")
  s.platform      = Gem::Platform::RUBY
  s.require_paths = ["lib"]
  s.license       = "MIT"

  s.add_dependency "jekyll", ">= 3.7", "< 5.0"
end