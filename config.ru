require 'rubygems'

use Rack::Static,
  :urls => "/",
  :root => "public",
  :index => "index.html"

use Rack::Static,
  :urls => ["/"],
  :root => "public"

run lambda { |env| [ 404, {"Content-Type" => "text/plain"}, ["Not found!"] ] }
