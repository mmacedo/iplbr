#!/usr/bin/env ruby

require 'json'
require 'unicode'

cwd = File.expand_path(File.dirname(__FILE__))

# Onde estão as listas de eleitos
pasta_de_entrada_eleitos = File.expand_path(File.join(cwd, "eleitos"))

# Onde está a população dos municípios
pasta_de_entrada_populacao = File.expand_path(File.join(cwd, "populacao"))

# Onde ficará o json
arquivo_de_saida = File.expand_path(File.join(File.dirname(cwd), "public", "eleitos.json"))


def normaliza_municipio(municipio, uf)
  municipio = Unicode::downcase(municipio)
  # Elimina todos os acentos
  municipio = municipio.gsub(%r{[áãâà]}i, 'a').gsub(%r{[éê]}i, 'e').gsub(%r{[í]}i, 'i').gsub(%r{[óõô]}i, 'o').gsub(%r{[úü]}i, 'u').gsub(%r{[ç]}i, 'c')
  # Contrai todos os d'
  municipio = municipio.gsub("da a", "d'a").gsub("do o", "d'o").gsub(" d ", " d'").gsub(" dagua", " d'agua")
  # Elimina hífen
  municipio = municipio.gsub('-', ' ')
  # Atualiza nomes errados ou desatualizados
  municipio = 'agua doce do maranhao' if municipio == 'agua doce' && uf == 'MA'
  municipio = 'aguas lindas de goias' if municipio == 'aguas lindas' && uf == 'GO'
  municipio = 'alagoinha do piaui' if municipio == 'alagoinha' && uf == 'PI'
  municipio = 'almeirim' if municipio == 'almerim' && uf == 'PA'
  municipio = 'alto boa vista' if municipio == 'alto da boa vista' && uf == 'MT'
  municipio = 'alto paraiso de goias' if municipio == 'alto paraiso' && uf == 'GO'
  municipio = 'amparo de sao francisco' if municipio == 'amparo do sao francisco' && uf == 'SE'
  municipio = 'aparecida do taboado' if municipio == 'aparecida do tabuado' && uf == 'MS'
  municipio = 'armacao dos buzios' if municipio == 'armacao de buzios' && uf == 'RJ'
  municipio = 'assu' if municipio == 'acu' && uf == 'RN'
  municipio = 'bady bassitt' if municipio == 'bady bassit' && uf == 'SP'
  municipio = 'balneario barra do sul' if municipio == 'balneario de barra do sul' && uf == 'SC'
  municipio = 'balneario camboriu' if municipio == 'balneario de camboriu' && uf == 'SC'
  municipio = 'bandeirantes do tocantins' if municipio == 'bandeirante' && uf == 'TO'
  municipio = 'barauna' if municipio == 'baraunas' && uf == 'PB'
  municipio = 'barro preto' if municipio == 'governador lomanto junior' && uf == 'BA'
  municipio = 'bataguassu' if municipio == 'bataguacu' && uf == 'MS'
  municipio = 'bataypora' if municipio == 'bataipora' && uf == 'MS'
  municipio = 'bela vista do maranhao' if municipio == 'bela vista' && uf == 'MA'
  municipio = 'bernardino de campos' if municipio == 'bernadino de campos' && uf == 'SP'
  municipio = 'boa vista do sul' if municipio == 'vinte e sete da boa vista' && uf == 'RS'
  municipio = 'boa saude' if municipio == 'januario cicco' && uf == 'RN'
  municipio = 'boa vista do ramos' if municipio == 'boa vista de ramos' && uf == 'AM'
  municipio = 'bom jesus de goias' if municipio == 'bom jesus' && uf == 'GO'
  municipio = 'brasopolis' if municipio == 'brazopolis' && uf == 'MG'
  municipio = 'brodowski' if municipio == 'brodosqui' && uf == 'SP'
  municipio = 'cabo de santo agostinho' if municipio == 'cabo' && uf == 'PE'
  municipio = 'caem' if municipio == 'anselmo da fonseca' && uf == 'BA'
  municipio = 'campo grande' if municipio == 'augusto severo' && uf == 'RN'
  municipio = 'campos dos goytacazes' if municipio == 'campos' && uf == 'RJ'
  municipio = 'caninde de sao francisco' if municipio == 'caninde do sao francisco' && uf == 'SE'
  municipio = 'catunda' if municipio == 'senador catunda' && uf == 'CE'
  municipio = 'cezarina' if municipio == 'cesarina' && uf == 'GO'
  municipio = 'chapada de areia' if municipio == "chapada d'areia" && uf == 'TO'
  municipio = 'chiapetta' if municipio == 'chiapeta' && uf == 'RS'
  municipio = 'conceicao das pedras' if municipio == 'conceicao da pedra' && uf == 'MG'
  municipio = 'conselheiro mairinck' if municipio == 'conselheiro mayrinck' && uf == 'PR'
  municipio = 'darcinopolis' if municipio == 'darcynopolis' && uf == 'TO'
  municipio = 'deputado irapuan pinheiro' if municipio == 'dep irapuan pinheiro' && uf == 'CE'
  municipio = 'divinopolis do tocantins' if municipio == 'divinopolis' && uf == 'TO'
  municipio = 'eldorado dos carajas' if municipio == 'eldorado do carajas' && uf == 'PA'
  municipio = 'erico cardoso' if municipio == 'agua quente' && uf == 'BA'
  municipio = 'espirito santo' if municipio == "espirito santo d'oeste" && uf == 'RN'
  municipio = 'eusebio' if municipio == 'euzebio' && uf == 'CE'
  municipio = 'fernando pedroza' if municipio == 'fernando pedrosa' && uf == 'RN'
  municipio = "figueiropolis d'oeste" if municipio == "figueiropoles d'oeste" && uf == 'MT'
  municipio = 'florinea' if municipio == 'florinia' && uf == 'SP'
  municipio = 'graccho cardoso' if municipio == 'gracho cardoso' && uf == 'SE'
  municipio = 'granjeiro' if municipio == 'grangeiro' && uf == 'CE'
  municipio = 'gouveia' if municipio == 'gouvea' && uf == 'MG'
  municipio = 'governador edison lobao' if municipio == 'governador edson lobao' && uf == 'MA'
  municipio = 'herval' if municipio == 'erval' && uf == 'RS'
  municipio = 'ilha de itamaraca' if municipio == 'itamaraca' && uf == 'PE'
  municipio = 'ipaussu' if municipio == 'ipaucu' && uf == 'SP'
  municipio = 'itabirinha de mantena' if municipio == 'itabirinha' && uf == 'MG'
  municipio = 'itaguaje' if municipio == 'itaguage' && uf == 'PR'
  municipio = 'itamogi' if municipio == 'itamoji' && uf == 'MG'
  municipio = "itapua d'oeste" if municipio == 'jamari' && uf == 'RO'
  municipio = 'jaboatao dos guararapes' if municipio == 'jaboatao' && uf == 'PE'
  municipio = 'juti' if municipio == 'juty' && uf == 'MS'
  municipio = 'lagoa de itaenga' if municipio == 'lagoa do itaenga' && uf == 'PE'
  municipio = 'lajeado' if municipio == 'lageado' && uf == 'TO'
  municipio = 'lajeado grande' if municipio == 'lageado grande' && uf == 'SC'
  municipio = 'luis alves' if municipio == 'luiz alves' && uf == 'SC'
  municipio = 'luis domingues' if municipio == 'luis domingues do maranhao' && uf == 'MA'
  municipio = 'luiziana' if municipio == 'luisiania' && uf == 'PR'
  municipio = 'luiziania' if municipio == 'luisiania' && uf == 'SP'
  municipio = 'manoel urbano' if municipio == 'manuel urbano' && uf == 'AC'
  municipio = 'mogi das cruzes' if municipio == 'moji das cruzes' && uf == 'SP'
  municipio = 'mogi guacu' if municipio == 'moji guacu' && uf == 'SP'
  municipio = 'mogi mirim' if municipio == 'moji mirim' && uf == 'SP'
  municipio = 'monte santo do tocantins' if municipio == 'monte santo' && uf == 'TO'
  municipio = 'moreira sales' if municipio == 'moreira salles' && uf == 'PR'
  municipio = 'muquem do sao francisco' if municipio == 'muquem de sao francisco' && uf == 'BA'
  municipio = 'mundo novo' if municipio == 'mundo novo de goias' && uf == 'GO'
  municipio = 'munhoz de melo' if municipio == 'munhoz de mello' && uf == 'PR'
  municipio = 'nova santa rita' if municipio == 'petronio portela' && uf == 'PI'
  municipio = 'novo airao' if municipio == 'novo ayrao' && uf == 'AM'
  municipio = 'nova bandeirantes' if municipio == 'nova bandeirante' && uf == 'MT'
  municipio = "nova brasilandia d'oeste" if municipio == 'nova brasilandia' && uf == 'RO'
  municipio = 'oliveira de fatima' if municipio == 'oliveira do tocantins' && uf == 'TO'
  municipio = 'palmeiras do tocantins' if municipio == 'mosquito' && uf == 'TO'
  municipio = 'paraty' if municipio == 'parati' && uf == 'RJ'
  municipio = 'paty do alferes' if municipio == 'pati do alferes' && uf == 'RJ'
  municipio = "pau d'arco do piaui" if municipio == 'pau darco do piaui' && uf == 'PI'
  municipio = 'pedra branca do amapari' if (municipio == 'agua branca do amapari' || municipio == 'amapari') && uf == 'AP'
  municipio = 'pedro regis' if municipio == 'retiro' && uf == 'PB'
  municipio = 'picarras' if municipio == 'balneario picarras' && uf == 'SC'
  municipio = 'pindai' if municipio == 'ouro branco' && uf == 'BA'
  municipio = 'pindorama do tocantins' if municipio == 'pindorama de goias' && uf == 'TO'
  municipio = 'pirassununga' if municipio == 'piracununga' && uf == 'SP'
  municipio = 'piumhi' if municipio == 'pium i' && uf == 'MG'
  municipio = 'porto esperidiao' if municipio == 'porto esperediao' && uf == 'MT'
  municipio = 'poxoreu' if municipio == 'poxoreo' && uf == 'MT'
  municipio = 'presidente castello branco' if municipio == 'presidente castelo branco' && uf == 'SC'
  municipio = 'sao jose dos quatro marcos' if municipio == 'quatro marcos' && uf == 'MT'
  municipio = 'quijingue' if municipio == 'quinjingue' && uf == 'BA'
  municipio = 'salmourao' if municipio == 'salmorao' && uf == 'SP'
  municipio = 'sud mennucci' if municipio == 'sud menucci' && uf == 'SP'
  municipio = 'santa cecilia' if municipio == 'santa cecilia de umbuzeiro' && uf == 'PB'
  municipio = 'santa cruz de monte castelo' if municipio == 'santa cruz do monte castelo' && uf == 'PR'
  municipio = 'santa isabel do ivai' if municipio == 'santa izabel do ivai' && uf == 'PR'
  municipio = 'santa isabel do para' if municipio == 'santa izabel do para' && uf == 'PA'
  municipio = 'santa maria de jetiba' if municipio == 'santa maria do jetiba' && uf == 'ES'
  municipio = 'santa rita de ibitipoca' if municipio == 'santa rita do ibitipoca' && uf == 'MG'
  municipio = 'santa rosa do purus' if municipio == 'santa rosa' && uf == 'AC'
  municipio = 'santa teresinha' if municipio == 'santa terezinha' && uf == 'BA'
  municipio = 'santana do itarare' if municipio == 'santa ana do itarare' && uf == 'PR'
  municipio = 'santo antonio de posse' if municipio == 'santo antonio da posse' && uf == 'SP'
  municipio = 'sao bentinho' if municipio == 'sao bento de pombal' && uf == 'PB'
  municipio = 'sao caitano' if municipio == 'sao caetano' && uf == 'PE'
  municipio = 'sao domingos do cariri' if municipio == 'sao domingos de cabaceiras' && uf == 'PB'
  municipio = 'sao domingos do norte' if municipio == 'sao domingos' && uf == 'ES'
  municipio = 'sao jose da lapa' if municipio == 'sao jose do lapa' && uf == 'MG'
  municipio = 'sao jose do brejo do cruz' if municipio == 'sao jose do brejo cruz' && uf == 'PB'
  municipio = 'sao jose do campestre' if municipio == 'sao jose de campestre' && uf == 'RN'
  municipio = 'sao luis de montes belos' if municipio == 'sao luis dos montes belos' && uf == 'GO'
  municipio = 'sao luiz' if municipio == 'sao luiz do anaua' && uf == 'RR'
  municipio = 'sao luiz gonzaga' if municipio == 'sao luis gonzaga' && uf == 'RS'
  municipio = 'sao raimundo do doca bezerra' if municipio == 'sao raimundo da doca bezerra' && uf == 'MA'
  municipio = 'sao sebastiao de lagoa de roca' if municipio == 'sao seb. de lagoa de roca' && uf == 'PB'
  municipio = 'sao thome das letras' if municipio == 'sao tome das letras' && uf == 'MG'
  municipio = 'sao valerio da natividade' if municipio == 'sao valerio do tocantins' && uf == 'TO'
  municipio = 'sao vicente do serido' if municipio == 'serido' && uf == 'PB'
  municipio = 'senador la rocque' if municipio == 'senador la roque' && uf == 'MA'
  municipio = 'serra caiada' if municipio == 'presidente juscelino' && uf == 'RN'
  municipio = 'suzanapolis' if municipio == 'suzanopolis' && uf == 'SP'
  municipio = 'tapurah' if municipio == 'tapura' && uf == 'MT'
  municipio = 'tejucuoca' if municipio == 'tejussuoca' && uf == 'CE'
  municipio = 'teotonio vilela' if municipio == 'senador teotonio vilela' && uf == 'AL'
  municipio = 'teresina de goias' if municipio == 'terezinha de goias' && uf == 'GO'
  municipio = 'trindade do sul' if municipio == 'trindade' && uf == 'RS'
  municipio = 'valparaiso' if municipio == 'valparaizo' && uf == 'SP'
  municipio = 'valparaiso de goias' if (municipio == 'valparaiso' || municipio == 'valparaizo') && uf == 'GO'
  municipio = 'varre sai' if municipio == 'varre e sai' && uf == 'RJ'
  municipio = 'vila bela da santissima trindade' if municipio == 'vila bela stssma trindade' && uf == 'MT'
  municipio = 'viseu' if municipio == 'vizeu' && uf == 'PA'

  municipio
end

def populacao(lista, uf, municipio, ano)
  ultimo_ano_com_dados = lista.keys.select { |i| i <= ano }.max
  if uf.nil?
    lista[ultimo_ano_com_dados]
  elsif municipio.nil?
    lista[ultimo_ano_com_dados][uf]
  elsif lista[ultimo_ano_com_dados][uf].has_key? municipio
    lista[ultimo_ano_com_dados][uf][municipio]
  else
    primeiro_ano_com_municipio = lista.keys.select { |i| lista[i][uf].has_key? municipio }.min

    raise "Não encontrado '#{municipio}' / #{uf} em #{ano}" unless lista.has_key? primeiro_ano_com_municipio
    lista[primeiro_ano_com_municipio][uf][municipio]
  end
end


# ------------------------------------------------------------
# Processa populacao/*.txt e carrega a população por município
# ------------------------------------------------------------

populacao_municipios, populacao_ufs, populacao_brasil = {}, {}, Hash.new(0)

Dir.glob(File.join(pasta_de_entrada_populacao, "*_municipios.txt")) do |arquivo|

  ano = File.basename(arquivo, ".txt").gsub(%r{_.*}, '').to_i

  populacao_municipios[ano], populacao_ufs[ano] = {}, Hash.new(0)

  IO.foreach(arquivo) do |linha|

    uf, municipio, populacao = linha.chomp.split(';')

    municipio = normaliza_municipio(municipio, uf)
    populacao = populacao.to_i

    populacao_municipios[ano][uf] ||= {}
    populacao_municipios[ano][uf][municipio] = populacao
    populacao_ufs[ano][uf] += populacao
    populacao_brasil[ano] += populacao

  end
end


# ------------------------------------------------------
# Processa eleitos/*.txt e carrega os totais por partido
# ------------------------------------------------------

municipais, estaduais, federais = {}, {}, {}

Dir.glob(File.join(pasta_de_entrada_eleitos, "*.txt")) do |arquivo|

  IO.foreach(arquivo) do |linha|

    ano, uf, municipio, cargo, numero, sigla, nome = linha.chomp.split(';')

    ano = ano.to_i
    municipio = normaliza_municipio(municipio, uf)
    partido   = "#{sigla}#{numero}"

    if cargo.match(%r{\APREFEITO|VEREADOR\z})

      ((((municipais[ano] ||= {})[uf] ||= {})[municipio] ||= {})[cargo] ||= Hash.new(0))[partido] += 1

    elsif cargo.match(%r{\AGOVERNADOR|DEPUTADO (ESTADUAL|DISTRITAL)\z})

      # Unifica DEPUTADO ESTADUAL e DEPUTADO DISTRITAL
      cargo.gsub!(%r{ESTADUAL|DISTRITAL}, "ESTADUAL OU DISTRITAL")

      (((estaduais[ano] ||= {})[uf] ||= {})[cargo] ||= Hash.new(0))[partido] += 1

    else

      ((federais[ano] ||= {})[cargo] ||= Hash.new(0))[partido] += 1

    end
  end
end


# --------------------------------------------------------------------
# Processa totais por partido e populações e gera os dados necessários
# --------------------------------------------------------------------

json = { municipais:{}, estaduais:{}, federais:{} }

municipais.each do |ano, ufs|

  json[:municipais][ano] = {
    total_prefeitos:                      0,
    total_vereadores:                     0,
    total_populacao:                      populacao(populacao_brasil, nil, nil, ano),
    prefeitos_por_sigla:                  Hash.new(0),
    prefeitos_por_sigla_peso_legislativo: Hash.new(0),
    prefeitos_por_sigla_peso_populacao:   Hash.new(0),
    vereadores_por_sigla:                 Hash.new(0),
    vereadores_por_sigla_peso_populacao:  Hash.new(0)
  }

  ufs.each do |uf, municipios|
    municipios.each do |municipio, cargos|

      # Ignora cidades que não tem os dados dos vereadores
      next unless cargos.has_key? 'VEREADOR'

      total_vereadores = cargos['VEREADOR'].map { |sigla, vereadores| vereadores }.reduce(:+)
      total_populacao  = populacao(populacao_municipios, uf, municipio, ano)

      json[:municipais][ano][:total_prefeitos]  += 1
      json[:municipais][ano][:total_vereadores] += total_vereadores

      if cargos.has_key? 'PREFEITO'
        cargos['PREFEITO'].each do |sigla, prefeitos|
          json[:municipais][ano][:prefeitos_por_sigla][sigla]                  += 1
          json[:municipais][ano][:prefeitos_por_sigla_peso_legislativo][sigla] += total_vereadores
          json[:municipais][ano][:prefeitos_por_sigla_peso_populacao][sigla]   += total_populacao
        end
      end

      cargos['VEREADOR'].each do |sigla, vereadores|
        json[:municipais][ano][:vereadores_por_sigla][sigla]                += vereadores
        json[:municipais][ano][:vereadores_por_sigla_peso_populacao][sigla] += vereadores * (total_populacao / total_vereadores)
      end
    end
  end
end

estaduais.each do |ano, ufs|

  json[:estaduais][ano] = {
    total_governadores:                           0,
    total_deputados_estaduais:                    0,
    total_populacao:                              populacao(populacao_brasil, nil, nil, ano),
    governadores_por_sigla:                       Hash.new(0),
    governadores_por_sigla_peso_legislativo:      Hash.new(0),
    governadores_por_sigla_peso_populacao:        Hash.new(0),
    deputados_estaduais_por_sigla:                Hash.new(0),
    deputados_estaduais_por_sigla_peso_populacao: Hash.new(0)
  }

  ufs.each do |uf, cargos|

    total_deputados_estaduais = cargos['DEPUTADO ESTADUAL OU DISTRITAL'].map { |sigla, deputados_estaduais| deputados_estaduais }.reduce(:+)
    total_populacao           = populacao(populacao_ufs, uf, nil, ano)

    json[:estaduais][ano][:total_governadores]        += 1
    json[:estaduais][ano][:total_deputados_estaduais] += total_deputados_estaduais

    cargos['GOVERNADOR'].each do |sigla, governadores|
      json[:estaduais][ano][:governadores_por_sigla][sigla]                  += 1
      json[:estaduais][ano][:governadores_por_sigla_peso_legislativo][sigla] += total_deputados_estaduais
      json[:estaduais][ano][:governadores_por_sigla_peso_populacao][sigla]   += total_populacao
    end

    cargos['DEPUTADO ESTADUAL OU DISTRITAL'].each do |sigla, deputados_estaduais|
      json[:estaduais][ano][:deputados_estaduais_por_sigla][sigla]                += deputados_estaduais
      json[:estaduais][ano][:deputados_estaduais_por_sigla_peso_populacao][sigla] += deputados_estaduais * (total_populacao / total_deputados_estaduais)
    end
  end
end

federais.each do |ano, cargos|

  json[:federais][ano] = {
    total_presidentes:            1,
    total_deputados_federais:     0,
    total_senadores:              0,
    presidentes_por_sigla:        Hash.new(0),
    deputados_federais_por_sigla: Hash.new(0),
    senadores_por_sigla:          Hash.new(0)
  }

  json[:federais][ano][:total_deputados_federais] = cargos['DEPUTADO FEDERAL'].map { |sigla, deputados_federais| deputados_federais }.reduce(:+)
  json[:federais][ano][:total_senadores] = cargos['SENADOR'].map { |sigla, senadores| senadores }.reduce(:+)

  cargos['PRESIDENTE'].each { |sigla, presidentes| json[:federais][ano][:presidentes_por_sigla][sigla] = 1 }

  cargos['DEPUTADO FEDERAL'].each do |sigla, deputados_federais|
    json[:federais][ano][:deputados_federais_por_sigla][sigla] += deputados_federais
  end

  cargos['SENADOR'].each do |sigla, senadores|
    json[:federais][ano][:senadores_por_sigla][sigla] += senadores
  end
end

IO.write(arquivo_de_saida, json.to_json)
