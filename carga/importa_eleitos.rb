#!/usr/bin/env ruby

require 'fileutils'
require 'set'

cwd = File.expand_path(File.dirname(__FILE__))

# Onde estão as pastas já extraídas
pasta_de_download = File.expand_path("~/Downloads")

# Onde ficarão os novos arquivos com lista de eleitos
pasta_de_saida    = File.join(cwd, "eleitos")
FileUtils.mkdir_p(pasta_de_saida)

# Faz carga de partidos em paralelo
# ja_carregados = IO.readlines(File.join(cwd, "partidos.txt")).map { |linha| linha.chomp.split(';') }
# partidos = SortedSet.new(ja_carregados.to_a)
partidos = SortedSet.new

# Quais pastas extrair (para 1994 e 1996 faltam estados)
anos = [ 1998, 2000, 2002, 2004, 2006, 2008, 2010, 2012, 2014 ]

# Quais arquivos extrair
ufs = %w{ AC AL AM AP BA CE DF ES GO MA MG MS MT PA PB PE PI PR RJ RN RO RR RS SC SE SP TO }

anos.each do |ano|

  # Seleciona colunas de acordo com o ano
  if ano <= 1990
    descricao_eleicao   = 4
    nome_municipio      = 5
    nome_candidato      = 10
    descricao_cargo     = 12
    desc_sit_cand_tot   = 18
    numero_partido      = 19
    sigla_partido       = 20
    nome_partido        = 21
  else
    descricao_eleicao   = 4
    nome_municipio      = 8
    nome_candidato      = 13
    descricao_cargo     = 15
    desc_sit_cand_tot   = 21
    numero_partido      = 22
    sigla_partido       = 23
    nome_partido        = 24
  end

  ufs.each do |uf|

    # Seleciona arquivo de acordo com o ano
    arquivo = if ano <= 1990
      "VOTACAO_CANDIDATO_UF_#{ano}/VOTACAO_CANDIDATO_UF_#{ano}_#{uf}.txt"
    else
      "votacao_candidato_munzona_#{ano}/votacao_candidato_munzona_#{ano}_#{uf}.txt"
    end
    arquivo = File.join(pasta_de_download, arquivo)

    if File.exists? arquivo

      linhas = IO.foreach(arquivo, encoding: "WINDOWS-1252:UTF-8", undef: :replace).lazy

      next if linhas.first.chomp == 'Não há dados para esta pesquisa !'

      sequenciais = Set.new
      visao       = []
      linhas.each do |linha|

        candidato   = linha.chomp.split(';').map { |coluna| coluna.sub(%r{\A"(.*)"\z}, '\1') }
        nome_completo = candidato[nome_candidato]

        # Verifica se não é repetido
        next if sequenciais.include?(nome_completo)

        # Verifica se foi eleito
        next unless candidato[desc_sit_cand_tot].match(%r{\AELEITO|M[ÉE]DIA\z})

        # Verifica se não é um plebiscito
        next unless candidato[descricao_eleicao].match(%r{\A(ELEI[ÇC][ÕO]ES|ELEI[ÇC][ÕO]ES GERAIS|ELEI[ÇC][ÃA]O MUNICIPAL) #{ano}\z})

        sequenciais << nome_completo

        cargo     = candidato[descricao_cargo]
        numero    = candidato[numero_partido]
        sigla     = candidato[sigla_partido]
        nome      = nome_completo
        municipio = if cargo.match(%r{\APREFEITO|VEREADOR\z}) then candidato[nome_municipio] else "" end

        visao << [ ano, uf, municipio, cargo, numero, sigla, nome ]

        # Carga paralela de partidos
        partido = [ ano.to_s, numero, sigla, candidato[nome_partido] ]
        unless partidos.include?(partido)
          partidos << partido
          IO.write(File.join(cwd, "partidos.txt"), partidos.map { |l| l.join(";") }.join("\n"))
        end
      end
      visao = visao.sort
    else
      visao = []
    end

    IO.write(File.join(pasta_de_saida, "#{ano}_#{uf.downcase}.txt"), visao.map { |l| l.join(";") }.join("\n"))
  end
end
