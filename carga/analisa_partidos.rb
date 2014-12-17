#!/usr/bin/env ruby

require 'unicode'

def capitalize_all_words(title)
  title.split.map { |word| Unicode::capitalize(word) }.join(' ')
end

cwd = File.expand_path(File.dirname(__FILE__))

partidos = IO.readlines(File.join(cwd, "partidos.txt"))
  .map { |linha| linha.chomp.split(';') }
  .map do |linha|
    {
      ano: linha[0],
      numero: linha[1],
      sigla: linha[2],
      nome: capitalize_all_words(linha[3])
    }
  end

partidos.map { |p| p[:numero] }.uniq.each do |numero|
  filtrados           = partidos.select { |p| p[:numero] == numero }
  siglas_do_partido   = filtrados.map { |p| p[:sigla] }.uniq
  nomes_do_partido    = filtrados.map { |p| p[:nome] }.uniq
  puts "Número #{numero} tem múltiplas siglas: #{siglas_do_partido.join(", ")}" if siglas_do_partido.count > 1
  puts "Número #{numero} tem múltiplos nomes: #{nomes_do_partido.join(", ")}" if nomes_do_partido.count > 1
end

partidos.map { |p| p[:sigla] }.uniq.each do |sigla|
  filtrados           = partidos.select { |p| p[:sigla] == sigla }
  numeros_do_partido  = filtrados.map { |p| p[:numero] }.uniq
  nomes_do_partido    = filtrados.map { |p| p[:nome] }.uniq
  puts "Sigla #{sigla} tem múltiplos números: #{numeros_do_partido.join(", ")}" if numeros_do_partido.count > 1
  puts "Sigla #{sigla} tem múltiplos nomes: #{nomes_do_partido.join(", ")}" if nomes_do_partido.count > 1
end

partidos.map { |p| p[:nome] }.uniq.each do |nome|
  filtrados           = partidos.select { |p| p[:nome] == nome }
  numeros_do_partido  = filtrados.map { |p| p[:numero] }.uniq
  siglas_do_partido   = filtrados.map { |p| p[:sigla] }.uniq
  puts "Nome #{nome} tem múltiplos números: #{numeros_do_partido.join(", ")}" if numeros_do_partido.count > 1
  puts "Nome #{nome} tem múltiplos siglas: #{siglas_do_partido.join(", ")}" if siglas_do_partido.count > 1
end
