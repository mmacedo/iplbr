#!/usr/bin/env ruby

require 'fileutils'

cwd = File.expand_path(File.dirname(__FILE__))

# Onde estão as pastas já extraídas
pasta_de_download = File.expand_path("~/Downloads")

# Onde ficarão os novos arquivos com lista de eleitos
pasta_de_saida    = File.expand_path(File.join(cwd, "eleitos"))
FileUtils.mkdir_p(pasta_de_saida)

# Quais pastas extrair (para 1994 e 1996 faltam estados)
anos = [1998, 2000, 2002, 2004, 2006, 2008, 2010, 2012, 2014]

# Quais arquivos extrair
ufs = %w{ AC AL AM AP BA CE DF ES GO MA MG MS MT PA PB PE PI PR RJ RN RO RR RS SC SE SP TO }

anos.each do |ano|

  # Seleciona colunas de acordo com o ano
  if ano <= 1990
    nome_municipio      = 5
    nome_candidato      = 10
    nome_urna_candidato = 11
    descricao_cargo     = 12
    desc_sit_cand_tot   = 18
    sigla_partido       = 20
  else
    nome_municipio      = 8
    nome_candidato      = 13
    nome_urna_candidato = 14
    descricao_cargo     = 15
    desc_sit_cand_tot   = 21
    sigla_partido       = 23
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
      sequenciais = {}
      visao = []
      IO.foreach(arquivo, encoding: "WINDOWS-1252:UTF-8") do |linha|
        candidato   = linha.chomp.split(';').map { |coluna| coluna.sub(%r{\A"(.*)"\z}, '\1') }
        chave_unica = candidato[nome_candidato]

        unless sequenciais.has_key?(chave_unica)
          if candidato[desc_sit_cand_tot].match(%r{\AELEITO|MÉDIA\z})
            sequenciais[chave_unica] = nil

            cargo     = candidato[descricao_cargo]
            sigla     = candidato[sigla_partido]
            nome      = candidato[nome_urna_candidato]
            municipio = if cargo.match(%r{\APREFEITO|VEREADOR\z}) then candidato[nome_municipio] else "" end

            visao << [ano, uf, municipio, cargo, sigla, nome]
          end
        end
      end
      visao = visao.sort
    else
      visao = []
    end

    IO.write(File.join(pasta_de_saida, "#{ano}_#{uf.downcase}.txt"), visao.map { |l| l.join(";") }.join("\n"))
  end
end
