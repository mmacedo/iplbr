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
  municipio = municipio
    .gsub(%r{[áãâà]}i, 'a')
    .gsub(%r{[éê]}i,   'e')
    .gsub(%r{[í]}i,    'i')
    .gsub(%r{[óõô]}i,  'o')
    .gsub(%r{[úü]}i,   'u')
    .gsub(%r{[ç]}i,    'c')
  # Contrai todos os d'
  municipio = municipio
    .gsub(" da a", " d'a")
    .gsub(" do o", " d'o")
    .gsub(" d ", " d'")
    .gsub(" dagua", " d'agua")
  # Elimina os hífens
  municipio = municipio.gsub('-', ' ')
  municipio
end

# Corrige quando os nomes estão errados no TSE e IBGE, mas em anos diferentes
def atualiza_municipios_ibge_e_tse(municipio, uf)
  case uf
  when 'MT'
    municipio = 'poxoreu' if municipio == 'poxoreo'
  when 'RN'
    municipio = 'boa saude' if municipio == 'januario cicco'
    municipio = 'serra caiada' if municipio == 'presidente juscelino'
  when 'RJ'
    municipio = 'paraty' if municipio == 'parati'
  when 'SC'
    municipio = 'luis alves' if municipio == 'luiz alves'
  when 'SP'
    municipio = 'mogi mirim' if municipio == 'moji mirim'
  end
  municipio
end

# Corrige quando os nomes estão errados no IBGE, mas corretos no TSE
def atualiza_municipios_ibge(municipio, uf)
  case uf
  when 'BA'
    municipio = 'muquem do sao francisco' if municipio == 'muquem de sao francisco'
  when 'PB'
    municipio = 'sao vicente do serido' if municipio == 'serido'
  when 'PE'
    municipio = 'lagoa de itaenga' if municipio == 'lagoa do itaenga'
  when 'RN'
    municipio = 'assu' if municipio == 'acu'
    municipio = 'campo grande' if municipio == 'augusto severo'
  when 'SE'
    municipio = 'graccho cardoso' if municipio == 'gracho cardoso'
  when 'SP'
    municipio = 'florinea' if municipio == 'florinia'
  end
  municipio
end

# Corrige quando os nomes estão errados no TSE, mas corretos no IBGE
def atualiza_municipios_tse(municipio, uf)
  case uf
  when 'AC'
    municipio = 'manoel urbano' if municipio == 'manuel urbano'
    municipio = 'santa rosa do purus' if municipio == 'santa rosa'
  when 'AL'
    municipio = 'teotonio vilela' if municipio == 'senador teotonio vilela'
  when 'AM'
    municipio = 'boa vista do ramos' if municipio == 'boa vista de ramos'
    municipio = 'novo airao' if municipio == 'novo ayrao'
  when 'AP'
    municipio = 'pedra branca do amapari' if municipio == 'agua branca do amapari'
    municipio = 'pedra branca do amapari' if municipio == 'amapari'
  when 'BA'
    municipio = 'barro preto' if municipio == 'governador lomanto junior'
    municipio = 'caem' if municipio == 'anselmo da fonseca'
    municipio = 'erico cardoso' if municipio == 'agua quente'
    municipio = 'pindai' if municipio == 'ouro branco'
    municipio = 'quijingue' if municipio == 'quinjingue'
    municipio = 'santa teresinha' if municipio == 'santa terezinha'
  when 'CE'
    municipio = 'catunda' if municipio == 'senador catunda'
    municipio = 'deputado irapuan pinheiro' if municipio == 'dep irapuan pinheiro'
    municipio = 'eusebio' if municipio == 'euzebio'
    municipio = 'granjeiro' if municipio == 'grangeiro'
    municipio = 'tejucuoca' if municipio == 'tejussuoca'
  when 'ES'
    municipio = 'santa maria de jetiba' if municipio == 'santa maria do jetiba'
    municipio = 'sao domingos do norte' if municipio == 'sao domingos'
  when 'GO'
    municipio = 'aguas lindas de goias' if municipio == 'aguas lindas'
    municipio = 'alto paraiso de goias' if municipio == 'alto paraiso'
    municipio = 'bom jesus de goias' if municipio == 'bom jesus'
    municipio = 'cezarina' if municipio == 'cesarina'
    municipio = 'mundo novo' if municipio == 'mundo novo de goias'
    municipio = 'sao luis de montes belos' if municipio == 'sao luis dos montes belos'
    municipio = 'teresina de goias' if municipio == 'terezinha de goias'
    municipio = 'valparaiso de goias' if municipio == 'valparaiso'
    municipio = 'valparaiso de goias' if municipio == 'valparaizo'
  when 'MA'
    municipio = 'agua doce do maranhao' if municipio == 'agua doce'
    municipio = 'bela vista do maranhao' if municipio == 'bela vista'
    municipio = 'governador edison lobao' if municipio == 'governador edson lobao'
    municipio = 'luis domingues' if municipio == 'luis domingues do maranhao'
    municipio = 'sao raimundo do doca bezerra' if municipio == 'sao raimundo da doca bezerra'
    municipio = 'senador la rocque' if municipio == 'senador la roque'
  when 'MG'
    municipio = 'brasopolis' if municipio == 'brazopolis'
    municipio = 'conceicao das pedras' if municipio == 'conceicao da pedra'
    municipio = 'gouveia' if municipio == 'gouvea'
    municipio = 'itabirinha de mantena' if municipio == 'itabirinha'
    municipio = 'itamogi' if municipio == 'itamoji'
    municipio = 'piumhi' if municipio == 'pium i'
    municipio = 'santa rita de ibitipoca' if municipio == 'santa rita do ibitipoca'
    municipio = 'sao jose da lapa' if municipio == 'sao jose do lapa'
    municipio = 'sao thome das letras' if municipio == 'sao tome das letras'
  when 'MT'
    municipio = 'alto boa vista' if municipio == 'alto da boa vista'
    municipio = "figueiropolis d'oeste" if municipio == "figueiropoles d'oeste"
    municipio = 'nova bandeirantes' if municipio == 'nova bandeirante'
    municipio = 'porto esperidiao' if municipio == 'porto esperediao'
    municipio = 'sao jose dos quatro marcos' if municipio == 'quatro marcos'
    municipio = 'tapurah' if municipio == 'tapura'
    municipio = 'vila bela da santissima trindade' if municipio == 'vila bela stssma trindade'
  when 'MS'
    municipio = 'aparecida do taboado' if municipio == 'aparecida do tabuado'
    municipio = 'bataguassu' if municipio == 'bataguacu'
    municipio = 'bataypora' if municipio == 'bataipora'
    municipio = 'juti' if municipio == 'juty'
  when 'PA'
    municipio = 'almeirim' if municipio == 'almerim'
    municipio = 'eldorado dos carajas' if municipio == 'eldorado do carajas'
    municipio = 'santa isabel do para' if municipio == 'santa izabel do para'
    municipio = 'viseu' if municipio == 'vizeu'
  when 'PB'
    municipio = 'barauna' if municipio == 'baraunas'
    municipio = 'pedro regis' if municipio == 'retiro'
    municipio = 'santa cecilia' if municipio == 'santa cecilia de umbuzeiro'
    municipio = 'sao bentinho' if municipio == 'sao bento de pombal'
    municipio = 'sao domingos do cariri' if municipio == 'sao domingos de cabaceiras'
    municipio = 'sao jose do brejo do cruz' if municipio == 'sao jose do brejo cruz'
    municipio = 'sao sebastiao de lagoa de roca' if municipio == 'sao seb. de lagoa de roca'
  when 'PE'
    municipio = 'cabo de santo agostinho' if municipio == 'cabo'
    municipio = 'ilha de itamaraca' if municipio == 'itamaraca'
    municipio = 'jaboatao dos guararapes' if municipio == 'jaboatao'
    municipio = 'sao caitano' if municipio == 'sao caetano'
  when 'PI'
    municipio = 'alagoinha do piaui' if municipio == 'alagoinha'
    municipio = 'nova santa rita' if municipio == 'petronio portela'
    municipio = "pau d'arco do piaui" if municipio == 'pau darco do piaui'
  when 'PR'
    municipio = 'conselheiro mairinck' if municipio == 'conselheiro mayrinck'
    municipio = 'itaguaje' if municipio == 'itaguage'
    municipio = 'luiziana' if municipio == 'luisiania'
    municipio = 'moreira sales' if municipio == 'moreira salles'
    municipio = 'munhoz de melo' if municipio == 'munhoz de mello'
    municipio = 'santa cruz de monte castelo' if municipio == 'santa cruz do monte castelo'
    municipio = 'santa isabel do ivai' if municipio == 'santa izabel do ivai'
    municipio = 'santana do itarare' if municipio == 'santa ana do itarare'
  when 'RJ'
    municipio = 'armacao dos buzios' if municipio == 'armacao de buzios'
    municipio = 'campos dos goytacazes' if municipio == 'campos'
    municipio = 'paty do alferes' if municipio == 'pati do alferes'
    municipio = 'varre sai' if municipio == 'varre e sai'
  when 'RN'
    municipio = 'espirito santo' if municipio == "espirito santo d'oeste"
    municipio = 'fernando pedroza' if municipio == 'fernando pedrosa'
    municipio = 'sao jose do campestre' if municipio == 'sao jose de campestre'
  when 'RO'
    municipio = "itapua d'oeste" if municipio == 'jamari'
    municipio = "nova brasilandia d'oeste" if municipio == 'nova brasilandia'
  when 'RR'
    municipio = 'sao luiz' if municipio == 'sao luiz do anaua'
  when 'RS'
    municipio = 'boa vista do sul' if municipio == 'vinte e sete da boa vista'
    municipio = 'chiapetta' if municipio == 'chiapeta'
    municipio = 'herval' if municipio == 'erval'
    municipio = 'sao luiz gonzaga' if municipio == 'sao luis gonzaga'
    municipio = 'trindade do sul' if municipio == 'trindade'
  when 'SE'
    municipio = 'amparo de sao francisco' if municipio == 'amparo do sao francisco'
    municipio = 'caninde de sao francisco' if municipio == 'caninde do sao francisco'
  when 'SC'
    municipio = 'balneario barra do sul' if municipio == 'balneario de barra do sul'
    municipio = 'balneario camboriu' if municipio == 'balneario de camboriu'
    municipio = 'lajeado grande' if municipio == 'lageado grande'
    municipio = 'picarras' if municipio == 'balneario picarras'
    municipio = 'presidente castello branco' if municipio == 'presidente castelo branco'
  when 'SP'
    municipio = 'bady bassitt' if municipio == 'bady bassit'
    municipio = 'bernardino de campos' if municipio == 'bernadino de campos'
    municipio = 'brodowski' if municipio == 'brodosqui'
    municipio = 'ipaussu' if municipio == 'ipaucu'
    municipio = 'luiziania' if municipio == 'luisiania'
    municipio = 'mogi das cruzes' if municipio == 'moji das cruzes'
    municipio = 'mogi guacu' if municipio == 'moji guacu'
    municipio = 'pirassununga' if municipio == 'piracununga'
    municipio = 'salmourao' if municipio == 'salmorao'
    municipio = 'santo antonio de posse' if municipio == 'santo antonio da posse'
    municipio = 'sud mennucci' if municipio == 'sud menucci'
    municipio = 'suzanapolis' if municipio == 'suzanopolis'
    municipio = 'valparaiso' if municipio == 'valparaizo'
  when 'TO'
    municipio = 'bandeirantes do tocantins' if municipio == 'bandeirante'
    municipio = 'chapada de areia' if municipio == "chapada d'areia"
    municipio = 'darcinopolis' if municipio == 'darcynopolis'
    municipio = 'divinopolis do tocantins' if municipio == 'divinopolis'
    municipio = 'lajeado' if municipio == 'lageado'
    municipio = 'monte santo do tocantins' if municipio == 'monte santo'
    municipio = 'oliveira de fatima' if municipio == 'oliveira do tocantins'
    municipio = 'palmeiras do tocantins' if municipio == 'mosquito'
    municipio = 'pindorama do tocantins' if municipio == 'pindorama de goias'
    municipio = 'sao valerio da natividade' if municipio == 'sao valerio do tocantins'
  end
  municipio
end

def populacao(lista, uf, municipio, ano)
  ultimo_ano = lista.keys.select { |i| i <= ano }.max || lista.keys.min
  if uf.nil?
    lista[ultimo_ano]
  elsif municipio.nil?
    lista[ultimo_ano][uf]
  elsif lista[ultimo_ano][uf].has_key? municipio
    lista[ultimo_ano][uf][municipio]
  else
    primeiro_ano = lista.keys.select { |i| lista[i][uf].has_key? municipio }.min
    raise "Não encontrado '#{municipio}' / #{uf} em #{ano}" unless lista.has_key? primeiro_ano
    lista[primeiro_ano][uf][municipio]
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
    municipio = atualiza_municipios_ibge(municipio, uf)
    municipio = atualiza_municipios_ibge_e_tse(municipio, uf)
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

municipais, estaduais, distritais, federais, presidenciais = {}, {}, {}, {}, {}

Dir.glob(File.join(pasta_de_entrada_eleitos, "*.txt")) do |arquivo|

  IO.foreach(arquivo) do |linha|

    ano, uf, municipio, cargo, numero, sigla, nome = linha.chomp.split(';')

    ano       = ano.to_i
    municipio = normaliza_municipio(municipio, uf)
    municipio = atualiza_municipios_tse(municipio, uf)
    municipio = atualiza_municipios_ibge_e_tse(municipio, uf)
    sigla     = sigla.gsub(/ /, '')
    partido   =
      if numero.to_i >= 10 then
        "#{sigla}#{numero}"
      else
        "#{sigla}#{numero.to_i+10}"
      end

    if cargo.match(%r{\APREFEITO|VEREADOR\z})
      municipais[uf] ||= {}
      municipais[uf][municipio] ||= {}
      municipais[uf][municipio][ano] ||= {}
      municipais[uf][municipio][ano] ||= {}
      municipais[uf][municipio][ano][cargo] ||= Hash.new(0)
      municipais[uf][municipio][ano][cargo][partido] += 1
    elsif cargo.match(%r{\AGOVERNADOR|DEPUTADO DISTRITAL\z}) and uf === 'DF'
      distritais[ano] ||= {}
      distritais[ano][cargo] ||= Hash.new(0)
      distritais[ano][cargo][partido] += 1
    elsif cargo.match(%r{\AGOVERNADOR|DEPUTADO ESTADUAL\z})
      estaduais[uf] ||= {}
      estaduais[uf][ano] ||= {}
      estaduais[uf][ano][cargo] ||= Hash.new(0)
      estaduais[uf][ano][cargo][partido] += 1
    elsif cargo.match(%r{\ADEPUTADO FEDERAL|SENADOR\z})
      federais[ano] ||= {}
      federais[ano][cargo] ||= Hash.new(0)
      federais[ano][cargo][partido] += 1
    elsif cargo.match(%r(\APRESIDENTE\z))
      presidenciais[ano] = partido
    else
      raise "Cargo '#{cargo}' encontrado!"
    end
  end
end


# --------------------------------------------------------------------
# Processa totais por partido e populações e gera os dados necessários
# --------------------------------------------------------------------

json = { BR: { populacao: {}, deputado_federal: {}, senador: {}, presidente: {} } }

federais.each do |ano, cargos|
  json[:BR][:populacao][ano] = populacao(populacao_brasil, nil, nil, ano)
  if cargos.has_key? 'DEPUTADO FEDERAL'
    deputados = json[:BR][:deputado_federal][ano] ||= { por_sigla: {}, total: 0, mandato: 4 }
    cargos['DEPUTADO FEDERAL'].each do |sigla, quantidade|
      deputados[:total] += quantidade
      deputados[:por_sigla][sigla] = quantidade
    end
  end
  if cargos.has_key? 'SENADOR'
    senadores = json[:BR][:senador][ano] ||= { por_sigla: {}, total: 0, mandato: 8 }
    cargos['SENADOR'].each do |sigla, quantidade|
      senadores[:total] += quantidade
      senadores[:por_sigla][sigla] = quantidade
    end
  end
end

presidenciais.each do |ano, sigla|
  json[:BR][:populacao][ano] ||= populacao(populacao_brasil, nil, nil, ano)
  presidentes = json[:BR][:presidente][ano] = { por_sigla: {}, total: 1 };
  presidentes[:mandato] = if ano == 1989 then 5 else 4 end
  presidentes[:por_sigla][sigla] = 1
end

estaduais.each do |uf, anos|
  json[uf.to_sym] ||= { populacao: {}, deputado_estadual: {}, governador: {} }
  anos.each do |ano, cargos|
    json[:BR][:populacao][ano] ||= populacao(populacao_brasil, nil, nil, ano)
    json[uf.to_sym][:populacao][ano] = populacao(populacao_ufs, uf, nil, ano)
    if cargos.has_key? 'GOVERNADOR'
      governadores = json[uf.to_sym][:governador][ano] = { por_sigla: {}, total: 0, mandato: 4 }
      cargos['GOVERNADOR'].each do |sigla, quantidade|
        governadores[:total] += quantidade
        governadores[:por_sigla][sigla] = quantidade
      end
    else
      puts "Faltando governador para #{uf} em #{ano}"
    end
    if cargos.has_key? 'DEPUTADO ESTADUAL'
      deputados = json[uf.to_sym][:deputado_estadual][ano] = { por_sigla: {}, total: 0, mandato: 4 }
      cargos['DEPUTADO ESTADUAL'].each do |sigla, quantidade|
        deputados[:total] += quantidade
        deputados[:por_sigla][sigla] = quantidade
      end
    else
      puts "Faltando deputados estaduais para #{uf} em #{ano}"
    end
  end
end

json[:DF] = { populacao: {}, deputado_distrital: {}, governador: {} }
distritais.each do |ano, cargos|
  json[:BR][:populacao][ano] ||= populacao(populacao_brasil, nil, nil, ano)
  json[:DF][:populacao][ano] = populacao(populacao_ufs, 'DF', nil, ano)
  if cargos.has_key? 'GOVERNADOR'
    governadores = json[:DF][:governador][ano] = { por_sigla: {}, total: 0, mandato: 4 }
    cargos['GOVERNADOR'].each do |sigla, quantidade|
      governadores[:total] += quantidade
      governadores[:por_sigla][sigla] = quantidade
    end
  else
    puts "Faltando governador para DF em #{ano}"
  end
  if cargos.has_key? 'DEPUTADO DISTRITAL'
    deputados = json[:DF][:deputado_distrital][ano] = { por_sigla: {}, total: 0, mandato: 4 }
    cargos['DEPUTADO DISTRITAL'].each do |sigla, quantidade|
      deputados[:total] += quantidade
      deputados[:por_sigla][sigla] = quantidade
    end
  else
    puts "Faltando deputados distritais para DF em #{ano}"
  end
end

municipais.each do |uf, municipios|
  json[uf.to_sym].update(vereador: {}, prefeito: {})
  municipios.each do |municipio, anos|
    anos.each do |ano, cargos|
      json[:BR][:populacao][ano] ||= populacao(populacao_brasil, nil, nil, ano)
      json[uf.to_sym][:populacao][ano] ||= populacao(populacao_ufs, uf, nil, ano)
      json[:DF][:populacao][ano] ||= populacao(populacao_ufs, 'DF', nil, ano)
      populacao_municipio = populacao(populacao_municipios, uf, municipio, ano)
      if cargos.has_key? 'VEREADOR'
        vereadores = json[uf.to_sym][:vereador][ano] ||= { por_sigla: {}, total: 0, mandato: 4 }
        total = cargos['VEREADOR'].values.reduce(:+)
        vereadores[:total] += total
        cargos['VEREADOR'].each do |sigla, quantidade|
          vereadores[:por_sigla][sigla] ||= { quantidade: 0, populacao: 0 }
          vereadores[:por_sigla][sigla][:quantidade] += quantidade
          vereadores[:por_sigla][sigla][:populacao] += quantidade * (populacao_municipio / total)
        end
      else
        puts "Faltando vereadores para #{municipio}/#{uf} em #{ano}"
      end
      if cargos.has_key? 'PREFEITO'
        prefeitos = json[uf.to_sym][:prefeito][ano] ||= { por_sigla: {}, total: 0, mandato: 4 }
        total = cargos['PREFEITO'].values.reduce(:+)
        prefeitos[:total] += total
        cargos['PREFEITO'].each do |sigla, quantidade|
          prefeitos[:por_sigla][sigla] ||= { quantidade: 0, populacao: 0 }
          prefeitos[:por_sigla][sigla][:quantidade] += quantidade
          prefeitos[:por_sigla][sigla][:populacao] += populacao_municipio
        end
      else
        puts "Faltando prefeito para #{municipio}/#{uf} em #{ano}"
      end
    end
  end
end

estimativas_br = json[:BR][:populacao]
ultimo_ano_br = estimativas_br.keys.max
estimativas_br[ultimo_ano_br + 1] = populacao(populacao_brasil, nil, nil, ultimo_ano_br + 1)

(json.keys - [:BR]).each do |uf|
  estimativas = json[uf][:populacao]
  ultimo_ano = estimativas.keys.max
  estimativas[ultimo_ano + 1] = populacao(populacao_ufs, uf, nil, ultimo_ano + 1)
end


# ---------------------------------------------
# Escreve o resultado em ../public/eleitos.json
# ---------------------------------------------

IO.write(arquivo_de_saida, json.to_json)
