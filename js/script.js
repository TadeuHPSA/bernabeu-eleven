// ============================================================================
// LÓGICA DAS TOOLBOXES CUSTOMIZADAS (DROPDOWNS ESTILIZADOS)
// ============================================================================
function setupCustomSelect(wrapperId, triggerId, nativeSelectId, callback) {
  const customSelect = document.getElementById(wrapperId);
  const trigger = document.getElementById(triggerId);
  const options = customSelect.querySelectorAll('.custom-option');
  const nativeSelect = document.getElementById(nativeSelectId);

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    // Fecha outros abertos primeiro
    document.querySelectorAll('.custom-select-wrapper').forEach(w => {
      if (w !== customSelect) w.classList.remove('open');
    });
    customSelect.classList.toggle('open');
  });

  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      trigger.textContent = option.textContent;
      customSelect.classList.remove('open');
      
      const value = option.getAttribute('data-value');
      nativeSelect.value = value;
      nativeSelect.dispatchEvent(new Event('change'));

      if (callback) callback(value);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupCustomSelect('customDifficultySelect', 'difficultyTrigger', 'difficultySelect');
  setupCustomSelect('customSpeedSelect', 'speedTrigger', 'speedSelect');
  setupCustomSelect('customDraftModeSelect', 'draftModeTrigger', 'draftModeSelect', (val) => {
    // Mantém a regra original de validação do draft
    if (typeof filledCount === 'function' && filledCount() > 0) {
      alert("O draft já começou! Reinicie para alterar o modo de jogo.");
    }
  });

  window.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
  });
});

// ============================================================================
// FUNÇÃO DE RESET E NAVEGAÇÃO
// ============================================================================
function backToLandingPage() {
  resetBtn.click();
  gameplayContainer.classList.add('hidden');
  aboutSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// CONFIGURAÇÕES GERAIS E BANCO DE DADOS TÁTICOS E DE ATLETAS
// ============================================================================
const POS_LABEL = {
  GOL:"Goleiro", LD:"Lateral Direito", ZAG:"Zagueiro", LE:"Lateral Esquerdo",
  VOL:"Volante", MC:"Meio-Campista", MEI:"Meia", PE:"Ponta Esquerda", CA:"Centroavante",
  PD:"Ponta Direita", ME:"Meia Esquerda", MD:"Meia Direita", SA:"Segundo Atacante"
};

const TACTICS_DB = {
  "4-3-3 Clássico": {
    formation: ["GOL","LD","ZAG","ZAG","LE","VOL","MC","MEI","PE","CA","PD"],
    coords: [[50,90],[78,72],[60,80],[40,80],[22,72],[50,58],[32,44],[68,44],[15,18],[50,10],[85,18]]
  },
  "4-4-2 Linha": {
    formation: ["GOL","LD","ZAG","ZAG","LE","MC","MC","ME","MD","CA","CA"],
    coords: [[50,90],[78,72],[60,80],[40,80],[22,72],[40,58],[60,58],[15,44],[85,44],[38,15],[62,15]]
  },
  "4-2-3-1": {
    formation: ["GOL","LD","ZAG","ZAG","LE","VOL","MC","ME","MD","SA","CA"],
    coords: [[50,90],[78,72],[60,80],[40,80],[22,72],[35,58],[65,58],[15,40],[85,40],[50,30],[50,10]]
  },
  "3-5-2 Elite": {
    formation: ["GOL","ZAG","ZAG","ZAG","VOL","VOL","MC","ME","MD","SA","CA"],
    coords: [[50,90],[50,80],[25,80],[75,80],[35,58],[65,58],[50,48],[15,40],[85,40],[40,20],[60,10]]
  },
  "4-3-3 (Ofensivo)": {
    formation: ["GOL","LD","ZAG","ZAG","LE","MC","MC","MC","PE","CA","PD"],
    coords: [[50,90],[85,75],[60,80],[40,80],[15,75],[35,50],[50,60],[65,50],[20,20],[50,10],[80,20]]
  },
  "4-1-2-1-2 (Losango)": {
    formation: ["GOL","LD","ZAG","ZAG","LE","VOL","ME","MD","MEI","CA","CA"],
    coords: [[50,90],[85,75],[60,80],[40,80],[15,75],[50,65],[20,40],[80,40],[50,30],[40,10],[60,10]]
  },
  "3-4-3": {
    formation: ["GOL","ZAG","ZAG","ZAG","MC","MC","ME","MD","PE","CA","PD"],
    coords: [[50,90],[35,80],[50,80],[65,80],[35,50],[65,50],[15,45],[85,45],[25,20],[50,10],[75,20]]
  },
  "4-1-4-1 (Equilibrado)": {
    formation: ["GOL","LD","ZAG","ZAG","LE","VOL","ME","MC","MC","MD","CA"],
    coords: [[50,90],[85,75],[60,80],[40,80],[15,75],[50,65],[15,40],[40,40],[60,40],[85,40],[50,10]]
  },
  "5-3-2 (Defensivo)": {
    formation: ["GOL","ZAG","ZAG","ZAG","LD","LE","MC","MC","MC","CA","CA"],
    coords: [[50,90],[50,80],[30,80],[70,80],[85,60],[15,60],[35,50],[50,45],[65,50],[40,15],[60,15]]
  },
  "4-2-2-2 (Quadrado Mágico)": {
    formation: ["GOL","LD","ZAG","ZAG","LE","VOL","VOL","MEI","MEI","CA","CA"],
    coords: [[50,90],[85,75],[40,80],[60,80],[15,75],[40,50],[60,50],[40,30],[60,30],[40,10],[60,10]]
  },
  "3-4-2-1": {
    formation: ["GOL","ZAG","ZAG","ZAG","VOL","VOL","ME","MD","MEI","MEI","CA"],
    coords: [[50,90],[30,80],[50,85],[70,80],[40,60],[60,60],[15,50],[85,50],[40,30],[60,30],[50,10]]
  },
  "4-5-1": {
    formation: ["GOL","LD","ZAG","ZAG","LE","ME","MC","MC","MC","MD","CA"],
    coords: [[50,90],[85,75],[40,80],[60,80],[15,75],[15,50],[40,50],[50,55],[60,50],[85,50],[50,10]]
  },
  "5-4-1 (Ônibus)": {
    formation: ["GOL","ZAG","ZAG","ZAG","LD","LE","ME","MC","MC","MD","CA"],
    coords: [[50,90],[35,80],[50,85],[65,80],[85,70],[15,70],[15,50],[40,50],[60,50],[85,50],[50,10]]
  },
  "4-3-2-1 (Árvore de Natal)": {
    formation: ["GOL","LD","ZAG","ZAG","LE","VOL","MC","MC","MEI","MEI","CA"],
    coords: [[50,90],[85,75],[60,80],[40,80],[15,75],[50,60],[35,50],[65,50],[35,30],[65,30],[50,10]]
  },
  "4-3-1-2 (Losango Estreito)": {
    formation: ["GOL","LD","ZAG","ZAG","LE","VOL","MC","MC","MEI","CA","CA"],
    coords: [[50,90],[85,75],[60,80],[40,80],[15,75],[50,60],[35,45],[65,45],[50,30],[40,10],[60,10]]
  },
  "3-4-1-2 (Ataque Total)": {
    formation: ["GOL","ZAG","ZAG","ZAG","MC","MC","ME","MD","MEI","CA","CA"],
    coords: [[50,90],[35,80],[50,80],[65,80],[40,55],[60,55],[15,50],[85,50],[50,30],[40,10],[60,10]]
  }
};

let activeTacticName = "4-3-3 Clássico";
let FORMATION = [...TACTICS_DB[activeTacticName].formation];
let COORDS = [...TACTICS_DB[activeTacticName].coords];

const SQUADS = {
    "1960 · O Time Imbatível": [
    {n:"Rogelio Domínguez", p:"GOL", ovr:82, roles:["GOL"]},
    {n:"Marquitos", p:"LD", ovr:79, roles:["LD"]},
    {n:"José Santamaría", p:"ZAG", ovr:86, roles:["ZAG"]},
    {n:"Pachín", p:"ZAG", ovr:78, roles:["ZAG"]},
    {n:"José María Vidal", p:"LE", ovr:77, roles:["LE", "VOL"]},
    {n:"José María Zárraga", p:"VOL", ovr:80, roles:["VOL"]},
    {n:"Del Sol", p:"MC", ovr:82, roles:["MC", "MEI"]},
    {n:"Canário", p:"PD", ovr:81, roles:["PD", "MD"]},
    {n:"Alfredo Di Stéfano", p:"MEI", ovr:94, roles:["MEI", "SA", "CA"]},
    {n:"Ferenc Puskás", p:"SA", ovr:93, roles:["SA", "CA"]},
    {n:"Paco Gento", p:"PE", ovr:89, roles:["PE", "ME"]}
  ],
  "1998 · La Séptima": [
    {n:"Bodo Illgner", p:"GOL", ovr:83, roles:["GOL"]},
    {n:"Christian Panucci", p:"LD", ovr:81, roles:["LD"]},
    {n:"Fernando Hierro", p:"ZAG", ovr:86, roles:["ZAG"]},
    {n:"Manolo Sanchís", p:"ZAG", ovr:80, roles:["ZAG"]},
    {n:"Roberto Carlos", p:"LE", ovr:87, roles:["LE"]},
    {n:"Christian Karembeu", p:"VOL", ovr:79, roles:["VOL", "MC"]},
    {n:"Fernando Redondo", p:"VOL", ovr:88, roles:["VOL", "MC"]},
    {n:"Clarence Seedorf", p:"MEI", ovr:86, roles:["MEI", "MC", "MD"]},
    {n:"Raúl González", p:"SA", ovr:88, roles:["SA", "PE"]},
    {n:"Predrag Mijatović", p:"CA", ovr:84, roles:["CA"]},
    {n:"Fernando Morientes", p:"CA", ovr:83, roles:["CA"]}
  ],
  "2000 · La Octava": [
    {n:"Bodo Illgner", p:"GOL", ovr:82, roles:["GOL"]},
    {n:"Míchel Salgado", p:"LD", ovr:80, roles:["LD"]},
    {n:"Fernando Hierro", p:"ZAG", ovr:85, roles:["ZAG", "VOL"]},
    {n:"Iván Campo", p:"ZAG", ovr:79, roles:["ZAG"]},
    {n:"Roberto Carlos", p:"LE", ovr:88, roles:["LE", "ME"]},
    {n:"Fernando Redondo", p:"VOL", ovr:87, roles:["VOL", "MC"]},
    {n:"Iván Helguera", p:"MC", ovr:80, roles:["MC", "VOL", "ZAG"]},
    {n:"Steve McManaman", p:"MEI", ovr:79, roles:["MEI", "ME", "MD"]},
    {n:"Nicolas Anelka", p:"PE", ovr:82, roles:["PE", "CA", "SA"]},
    {n:"Fernando Morientes", p:"CA", ovr:85, roles:["CA"]},
    {n:"Raúl González", p:"PD", ovr:90, roles:["PD", "SA", "MEI"]}
  ],
  "2002 · La Novena": [
    {n:"Iker Casillas", p:"GOL", ovr:88, roles:["GOL"]},
    {n:"Míchel Salgado", p:"LD", ovr:82, roles:["LD"]},
    {n:"Fernando Hierro", p:"ZAG", ovr:86, roles:["ZAG"]},
    {n:"Iván Helguera", p:"ZAG", ovr:80, roles:["ZAG", "VOL"]},
    {n:"Roberto Carlos", p:"LE", ovr:89, roles:["LE", "ME"]},
    {n:"Claude Makelele", p:"VOL", ovr:85, roles:["VOL"]},
    {n:"Zinedine Zidane", p:"MEI", ovr:95, roles:["MEI", "MC", "ME"]},
    {n:"Steve McManaman", p:"MC", ovr:79, roles:["MC", "MEI"]},
    {n:"Raúl González", p:"SA", ovr:92, roles:["SA", "PE", "MEI"]},
    {n:"Ronaldo Nazário", p:"CA", ovr:93, roles:["CA"]},
    {n:"Luís Figo", p:"PD", ovr:91, roles:["PD", "MD", "MEI"]}
  ],
  "2005 · Os Galácticos ": [
    {n:"Iker Casillas", p:"GOL", ovr:89, roles:["GOL"]},
    {n:"Míchel Salgado", p:"LD", ovr:81, roles:["LD"]},
    {n:"Iván Helguera", p:"ZAG", ovr:81, roles:["ZAG", "VOL"]},
    {n:"Walter Samuel", p:"ZAG", ovr:84, roles:["ZAG"]},
    {n:"Roberto Carlos", p:"LE", ovr:89, roles:["LE", "ME"]},
    {n:"David Beckham", p:"MD", ovr:88, roles:["MD", "MC", "VOL"]},
    {n:"Thomas Gravesen", p:"VOL", ovr:80, roles:["VOL", "MC"]},
    {n:"Zinedine Zidane", p:"ME", ovr:94, roles:["ME", "MEI", "MC"]},
    {n:"Raúl González", p:"SA", ovr:89, roles:["SA", "MEI"]},
    {n:"Ronaldo Nazário", p:"CA", ovr:92, roles:["CA"]},
    {n:"Michael Owen", p:"CA", ovr:86, roles:["CA", "SA"]}
  ],
  "2012 · Liga Recorde (Mourinho)": [
    {n:"Iker Casillas", p:"GOL", ovr:87, roles:["GOL"]},
    {n:"Álvaro Arbeloa", p:"LD", ovr:80, roles:["LD"]},
    {n:"Sergio Ramos", p:"ZAG", ovr:87, roles:["ZAG", "LD"]},
    {n:"Pepe", p:"ZAG", ovr:85, roles:["ZAG"]},
    {n:"Marcelo", p:"LE", ovr:85, roles:["LE", "ME"]},
    {n:"Xabi Alonso", p:"VOL", ovr:87, roles:["VOL", "MC"]},
    {n:"Mesut Özil", p:"MEI", ovr:86, roles:["MEI", "ME", "MD"]},
    {n:"Sami Khedira", p:"MC", ovr:83, roles:["MC", "VOL"]},
    {n:"Cristiano Ronaldo", p:"PE", ovr:94, roles:["PE", "CA", "SA"]},
    {n:"Karim Benzema", p:"CA", ovr:85, roles:["CA", "SA"]},
    {n:"Ángel Di María", p:"PD", ovr:85, roles:["PD", "MD", "MEI"]}
  ],
  "2014 · La Décima": [
    {n:"Iker Casillas", p:"GOL", ovr:86, roles:["GOL"]},
    {n:"Dani Carvajal", p:"LD", ovr:83, roles:["LD"]},
    {n:"Sergio Ramos", p:"ZAG", ovr:90, roles:["ZAG", "LD"]},
    {n:"Pepe", p:"ZAG", ovr:85, roles:["ZAG"]},
    {n:"Marcelo", p:"LE", ovr:87, roles:["LE", "ME"]},
    {n:"Xabi Alonso", p:"VOL", ovr:87, roles:["VOL", "MC"]},
    {n:"Luka Modrić", p:"MC", ovr:88, roles:["MC", "VOL", "MEI"]},
    {n:"Ángel Di María", p:"MEI", ovr:86, roles:["MEI", "MC", "ME", "PD"]},
    {n:"Cristiano Ronaldo", p:"PE", ovr:96, roles:["PE", "CA", "SA"]},
    {n:"Karim Benzema", p:"CA", ovr:88, roles:["CA", "SA"]},
    {n:"Gareth Bale", p:"PD", ovr:88, roles:["PD", "MD", "PE"]}
  ],
  "2017 · La Duodécima": [
    {n:"Keylor Navas", p:"GOL", ovr:85, roles:["GOL"]},
    {n:"Dani Carvajal", p:"LD", ovr:85, roles:["LD"]},
    {n:"Sergio Ramos", p:"ZAG", ovr:90, roles:["ZAG"]},
    {n:"Raphaël Varane", p:"ZAG", ovr:86, roles:["ZAG"]},
    {n:"Marcelo", p:"LE", ovr:88, roles:["LE", "ME"]},
    {n:"Casemiro", p:"VOL", ovr:85, roles:["VOL"]},
    {n:"Toni Kroos", p:"MC", ovr:89, roles:["MC", "VOL", "MEI"]},
    {n:"Luka Modrić", p:"MEI", ovr:90, roles:["MEI", "MC"]},
    {n:"Karim Benzema", p:"CA", ovr:87, roles:["CA"]},
    {n:"Cristiano Ronaldo", p:"CA", ovr:95, roles:["CA", "SA"]},
    {n:"Isco", p:"PD", ovr:85, roles:["PD", "MEI", "ME"]}
  ],
  "2018 · La Decimotercera": [
    {n:"Keylor Navas", p:"GOL", ovr:85, roles:["GOL"]},
    {n:"Dani Carvajal", p:"LD", ovr:85, roles:["LD"]},
    {n:"Sergio Ramos", p:"ZAG", ovr:89, roles:["ZAG"]},
    {n:"Raphaël Varane", p:"ZAG", ovr:87, roles:["ZAG"]},
    {n:"Marcelo", p:"LE", ovr:87, roles:["LE", "ME"]},
    {n:"Casemiro", p:"VOL", ovr:86, roles:["VOL"]},
    {n:"Toni Kroos", p:"MC", ovr:89, roles:["MC", "VOL"]},
    {n:"Luka Modrić", p:"MEI", ovr:91, roles:["MEI", "MC"]},
    {n:"Karim Benzema", p:"CA", ovr:86, roles:["CA", "SA"]},
    {n:"Cristiano Ronaldo", p:"CA", ovr:95, roles:["CA", "SA"]},
    {n:"Gareth Bale", p:"PD", ovr:87, roles:["PD", "MD"]}
  ],
  "2024 · La Decimoquinta": [
    {n:"Thibaut Courtois", p:"GOL", ovr:91, roles:["GOL"]},
    {n:"Dani Carvajal", p:"LD", ovr:86, roles:["LD"]},
    {n:"Antonio Rüdiger", p:"ZAG", ovr:88, roles:["ZAG"]},
    {n:"Nacho Fernández", p:"ZAG", ovr:81, roles:["ZAG", "LD", "LE"]},
    {n:"Ferland Mendy", p:"LE", ovr:82, roles:["LE"]},
    {n:"Eduardo Camavinga", p:"VOL", ovr:85, roles:["VOL", "MC", "LE"]},
    {n:"Toni Kroos", p:"MC", ovr:88, roles:["MC", "VOL"]},
    {n:"Federico Valverde", p:"MD", ovr:89, roles:["MD", "MC", "VOL"]},
    {n:"Jude Bellingham", p:"MEI", ovr:92, roles:["MEI", "MC", "SA"]},
    {n:"Vinícius Júnior", p:"PE", ovr:91, roles:["PE", "CA", "SA"]},
    {n:"Rodrygo Goes", p:"PD", ovr:86, roles:["PD", "PE", "SA"]}
  ],
  "2025 · Galácticos 2.0": [
    {n:"Thibaut Courtois", p:"GOL", ovr:91, roles:["GOL"]},
    {n:"Dani Carvajal", p:"LD", ovr:86, roles:["LD"]},
    {n:"Éder Militão", p:"ZAG", ovr:85, roles:["ZAG"]},
    {n:"Antonio Rüdiger", p:"ZAG", ovr:88, roles:["ZAG"]},
    {n:"Ferland Mendy", p:"LE", ovr:82, roles:["LE"]},
    {n:"Aurélien Tchouaméni", p:"VOL", ovr:86, roles:["VOL", "ZAG"]},
    {n:"Federico Valverde", p:"MC", ovr:89, roles:["MC", "MD"]},
    {n:"Jude Bellingham", p:"MEI", ovr:92, roles:["MEI", "MC", "SA"]},
    {n:"Rodrygo Goes", p:"PD", ovr:86, roles:["PD", "PE", "SA"]},
    {n:"Vinícius Júnior", p:"PE", ovr:92, roles:["PE", "CA", "SA"]},
    {n:"Kylian Mbappé", p:"CA", ovr:93, roles:["CA", "PE", "SA"]}
  ],
  "2026 · La Maestría": [
    {n:"Thibaut Courtois", p:"GOL", ovr:92, roles:["GOL"]},
    {n:"Trent Alexander-Arnold", p:"LD", ovr:88, roles:["LD", "MD"]},
    {n:"Antonio Rüdiger", p:"ZAG", ovr:89, roles:["ZAG"]},
    {n:"Dean Huijsen", p:"ZAG", ovr:83, roles:["ZAG"]},
    {n:"Álvaro Carreras", p:"LE", ovr:82, roles:["LE"]},
    {n:"Federico Valverde", p:"VOL", ovr:90, roles:["VOL", "MC", "MD", "LD"]},
    {n:"Aurélien Tchouaméni", p:"VOL", ovr:87, roles:["VOL", "MC"]},
    {n:"Arda Güler", p:"MEI", ovr:85, roles:["MEI", "MD", "PD"]},
    {n:"Brahim Díaz", p:"PD", ovr:86, roles:["PD", "MD"]},
    {n:"Vinícius Júnior", p:"PE", ovr:93, roles:["PE", "CA"]},
    {n:"Kylian Mbappé", p:"CA", ovr:94, roles:["CA", "PD", "PE"]}
  ]
};

// ANOS DE NASCIMENTO (para calcular a idade do jogador de acordo com o ano do elenco em que ele foi sorteado)
const BIRTH_YEAR = {
  "Alfredo Di Stéfano": 1926, "Antonio Rüdiger": 1993, "Arda Güler": 2005, "Aurélien Tchouaméni": 2000,
  "Bodo Illgner": 1967, "Brahim Díaz": 1999, "Canário": 1929, "Casemiro": 1992, "Christian Karembeu": 1970,
  "Christian Panucci": 1973, "Clarence Seedorf": 1976, "Claude Makelele": 1973, "Cristiano Ronaldo": 1985,
  "Dani Carvajal": 1992, "David Beckham": 1975, "Dean Huijsen": 2005, "Del Sol": 1935, "Eduardo Camavinga": 2002,
  "Federico Valverde": 1998, "Ferenc Puskás": 1927, "Ferland Mendy": 1995, "Fernando Hierro": 1968,
  "Fernando Morientes": 1976, "Fernando Redondo": 1969, "Gareth Bale": 1989, "Iker Casillas": 1981, "Isco": 1992,
  "Iván Campo": 1974, "Iván Helguera": 1975, "José María Vidal": 1932, "José María Zárraga": 1930,
  "José Santamaría": 1929, "Jude Bellingham": 2003, "Karim Benzema": 1987, "Keylor Navas": 1986,
  "Kylian Mbappé": 1998, "Luka Modrić": 1985, "Luís Figo": 1972, "Manolo Sanchís": 1965, "Marcelo": 1988,
  "Marquitos": 1933, "Mesut Özil": 1988, "Michael Owen": 1979, "Míchel Salgado": 1975, "Nacho Fernández": 1990,
  "Nicolas Anelka": 1979, "Pachín": 1935, "Paco Gento": 1933, "Pepe": 1983, "Predrag Mijatović": 1969,
  "Raphaël Varane": 1993, "Raúl González": 1977, "Roberto Carlos": 1973, "Rodrygo Goes": 2001,
  "Rogelio Domínguez": 1933, "Ronaldo Nazário": 1976, "Sami Khedira": 1987, "Sergio Ramos": 1986,
  "Steve McManaman": 1972, "Thibaut Courtois": 1992, "Thomas Gravesen": 1976, "Toni Kroos": 1990,
  "Trent Alexander-Arnold": 1998, "Vinícius Júnior": 2000, "Walter Samuel": 1978, "Xabi Alonso": 1981,
  "Zinedine Zidane": 1972, "Álvaro Arbeloa": 1983, "Álvaro Carreras": 2003, "Ángel Di María": 1988,
  "Éder Militão": 1998
};

// Calcula a idade "de época" do jogador: ano do elenco sorteado (xi[i].from) menos o ano de nascimento
function getPlayerAge(pl) {
  if (!pl) return null;
  const birthYear = BIRTH_YEAR[pl.n];
  if (!birthYear) return null;
  const fromMatch = pl.from ? pl.from.match(/(\d{4})/) : null;
  const squadYear = fromMatch ? parseInt(fromMatch[1]) : 2024;
  return squadYear - birthYear;
}

// RIVAIS TRADICIONAIS (para as quests de "clássicos" e "pedra no sapato")
const TRADITIONAL_RIVALS = ["Barcelona", "Atlético de Madrid", "Manchester City", "Liverpool", "Bayern de Munique", "Juventus", "PSG", "Arsenal", "Inter de Milão", "Milan"];
const CLASSIC_RIVALS = ["Barcelona", "Atlético de Madrid"];

// HABILIDADE DE COBRANÇA DE FALTA (chance de gol de falta convertida quando ele é o batedor)
const FREEKICK_ABILITY = {
  "Cristiano Ronaldo": 0.50,
  "Roberto Carlos": 0.45,
  "David Beckham": 0.40,
  "Toni Kroos": 0.35,
  "Zinedine Zidane": 0.28,
  "Luís Figo": 0.20,
  "Sergio Ramos": 0.20,
  "Trent Alexander-Arnold": 0.20,
  "Luka Modrić": 0.18,
  "Ferenc Puskás": 0.18,
  "Arda Güler": 0.16,
  "Federico Valverde": 0.16,
  "Gareth Bale": 0.16,
  "Alfredo Di Stéfano": 0.15,
  "Mesut Özil": 0.15,
  "Marcelo": 0.13,
  "Ángel Di María": 0.13,
  "Xabi Alonso": 0.12,
  "Isco": 0.12,
  "Kylian Mbappé": 0.08,
  "Karim Benzema": 0.08,
  "Jude Bellingham": 0.08,
  "Aurélien Tchouaméni": 0.07,
  "Casemiro": 0.06,
  "Sami Khedira": 0.06,
  "Rodrygo Goes": 0.05,
  "Ronaldo Nazário": 0.04,
  "Vinícius Júnior": 0.02
};

const FREEKICK_POS_BASE = {
  GOL: 0.004, ZAG: 0.03, LD: 0.035, LE: 0.035, VOL: 0.045,
  MC: 0.06, MEI: 0.08, ME: 0.07, MD: 0.07, SA: 0.05, PE: 0.045, PD: 0.045, CA: 0.04
};

function getFreekickProb(pl) {
  if (!pl) return 0;
  if (FREEKICK_ABILITY.hasOwnProperty(pl.n)) return FREEKICK_ABILITY[pl.n];
  const base = FREEKICK_POS_BASE[pl.p] ?? 0.04;
  const ovrScale = 0.6 + (pl.ovr || 80) / 250;
  return Math.min(0.35, base * ovrScale);
}

// MAPEAMENTO EXPANDIDO DOS ADVERSÁRIOS E ARTILHEIROS (MATA-MATA MAIS COMPLETO)
const OPPONENTS = [
  {n:"Manchester City", s:89, arena:"Etihad Stadium", squad: ["Erling Haaland", "Phil Foden", "Kevin De Bruyne", "Bernardo Silva", "Jack Grealish", "Rodri", "Jérémy Doku", "Rúben Dias", "Ederson", "Manuel Akanji", "John Stones", "Kyle Walker", "Mateo Kovačić", "Savinho", "Josko Gvardiol"]},
  {n:"Arsenal", s:86, arena:"Emirates Stadium", squad: ["Viktor Gyökeres", "Bukayo Saka", "Martin Ødegaard", "Gabriel Martinelli", "Declan Rice", "Kai Havertz", "Riccardo Calafiori", "Leandro Trossard", "William Saliba", "Gabriel Magalhães", "David Raya", "Ben White", "Thomas Partey", "Gabriel Jesus", "Mikel Merino"]},
  {n:"Liverpool", s:87, arena:"Anfield Road", squad: ["Mohamed Salah", "Florian Wirtz", "Darwin Núñez", "Alexis Mac Allister", "Dominik Szoboszlai", "Cody Gakpo", "Virgil van Dijk", "Andy Robertson", "Ibrahima Konaté", "Alisson Becker", "Diogo Jota", "Curtis Jones", "Ryan Gravenberch", "Trent Alexander-Arnold", "Joe Gomez"]},
  {n:"Aston Villa", s:84, arena:"Villa Park", squad: ["Ollie Watkins", "Youri Tielemans", "Pau Torres", "Emiliano Martínez", "Morgan Rogers", "Leon Bailey", "John McGinn", "Ezri Konsa", "Lucas Digne", "Amadou Onana", "Jhon Durán", "Jacob Ramsey", "Matty Cash"]},
  {n:"Barcelona", s:88, arena:"Camp Nou", squad: ["Robert Lewandowski", "Lamine Yamal", "Raphinha", "Dani Olmo", "Pedri", "Frenkie de Jong", "Gavi", "Alejandro Balde", "Jules Koundé", "Marc-André ter Stegen", "Pau Cubarsí", "Ferran Torres", "Ansu Fati", "Fermín López"]},
  {n:"Girona", s:81, arena:"Estadi Montilivi", squad: ["Abel Ruiz", "Viktor Tsygankov", "Miguel Gutiérrez", "Yangel Herrera", "Arnau Martínez", "Paulo Gazzaniga", "Donny van de Beek", "Bryan Gil", "Ladislav Krejčí"]},
  {n:"Atlético de Madrid", s:84, arena:"Cívitas Metropolitano", squad: ["Antoine Griezmann", "Julián Alvarez", "Alexander Sorloth", "Rodrigo De Paul", "Marcos Llorente", "Angel Correa", "Jan Oblak", "José María Giménez", "Robin Le Normand", "Samuel Lino", "Conor Gallagher", "Axel Witsel", "César Azpilicueta"]},
  {n:"Bayer Leverkusen", s:85, arena:"BayArena", squad: ["Victor Boniface", "Granit Xhaka", "Alejandro Grimaldo", "Jeremie Frimpong", "Patrik Schick", "Edmond Tapsoba", "Piero Hincapié", "Lukas Hradecky", "Exequiel Palacios", "Jonas Hofmann", "Amine Adli"]},
  {n:"Stuttgart", s:82, arena:"MHPArena", squad: ["Deniz Undav", "Ermedin Demirović", "Atakan Karazor", "Angelo Stiller", "Alexander Nübel", "Josha Vagnoman", "Anthony Rouault", "Enzo Millot", "Chris Führich"]},
  {n:"Bayern de Munique", s:88, arena:"Allianz Arena", squad: ["Harry Kane", "Jamal Musiala", "Leroy Sané", "Joshua Kimmich", "Thomas Müller", "Serge Gnabry", "Luis Díaz", "Kim Min-jae", "Alphonso Davies", "Dayot Upamecano", "Manuel Neuer", "Leon Goretzka", "Konrad Laimer", "Michael Olise"]},
  {n:"RB Leipzig", s:84, arena:"Red Bull Arena", squad: ["Loïs Openda", "Xavi Simons", "Castello Lukeba", "Péter Gulácsi", "Christoph Baumgartner", "Amadou Haidara", "Lukas Klostermann", "Benjamin Henrichs", "Willi Orbán", "Arthur Vermeeren", "Yussuf Poulsen", "Lutsharel Geertruida"]},
  {n:"Borussia Dortmund", s:82, arena:"Signal Iduna Park", squad: ["Serhou Guirassy", "Julian Brandt", "Karim Adeyemi", "Marcel Sabitzer", "Jamie Bynoe-Gittens", "Emre Can", "Nico Schlotterbeck", "Gregor Kobel", "Ramy Bensebaini", "Niklas Süle", "Pascal Groß", "Maximilian Beier"]},
  {n:"Inter de Milão", s:84, arena:"Stadio Giuseppe Meazza", squad: ["Lautaro Martínez", "Marcus Thuram", "Nicolò Barella", "Hakan Calhanoglu", "Davide Frattesi", "Federico Dimarco", "Yann Sommer", "Benjamin Pavard", "Alessandro Bastoni", "Henrikh Mkhitaryan", "Denzel Dumfries", "Stefan de Vrij", "Mehdi Taremi"]},
  {n:"Atalanta", s:84, arena:"Gewiss Stadium", squad: ["Ademola Lookman", "Mateo Retegui", "Éderson", "Marten de Roon", "Charles De Ketelaere", "Sead Kolašinac", "Marco Carnesecchi", "Berat Djimsiti", "Nicolò Zaniolo", "Davide Zappacosta"]},
  {n:"Milan", s:85, arena:"San Siro", squad: ["Rafael Leão", "Christian Pulisic", "Álvaro Morata", "Tijjani Reijnders", "Theo Hernández", "Ruben Loftus-Cheek", "Mike Maignan", "Fikayo Tomori", "Samuel Chukwueze", "Noah Okafor", "Ismaël Bennacer", "Davide Calabria", "Youssouf Fofana"]},
  {n:"Juventus", s:85, arena:"Juventus Stadium", squad: ["Dusan Vlahović", "Kenan Yildiz", "Teun Koopmeiners", "Douglas Luiz", "Nico González", "Timothy Weah", "Bremer", "Manuel Locatelli", "Federico Gatti", "Michele Di Gregorio", "Andrea Cambiaso", "Danilo", "Francisco Conceição", "Khéphren Thuram"]},
  {n:"Bologna", s:81, arena:"Stadio Renato Dall'Ara", squad: ["Riccardo Orsolini", "Dan Ndoye", "Remo Freuler", "Giovanni Fabbian", "Stefan Posch", "Jhon Lucumí", "Samuel Iling-Junior", "Santiago Castro", "Łukasz Skorupski", "Thijs Dallinga"]},
  {n:"PSG", s:86, arena:"Parc des Princes", squad: ["Bradley Barcola", "Ousmane Dembélé", "Vitinha", "Warren Zaïre-Emery", "Gonçalo Ramos", "Randal Kolo Muani", "Gianluigi Donnarumma", "Marquinhos", "Nuno Mendes", "Achraf Hakimi", "Marco Asensio", "Lee Kang-in", "Willian Pacho"]},
  {n:"Monaco", s:83, arena:"Stade Louis II", squad: ["Breel Embolo", "Aleksandr Golovin", "Denis Zakaria", "Lamine Camara", "Vanderson", "Philipp Köhn", "Folarin Balogun", "Takumi Minamino", "Thilo Kehrer"]},
  {n:"Brest", s:79, arena:"Stade Francis-Le Blé", squad: ["Ludovic Ajorque", "Romain Del Castillo", "Pierre Lees-Melou", "Kenny Lala", "Marco Bizot", "Abdallah Sima", "Mahdi Camara"]},
  {n:"Lille", s:82, arena:"Stade Pierre-Mauroy", squad: ["Jonathan David", "Edon Zhegrova", "Benjamin André", "Lucas Chevalier", "Bafodé Diakité", "Gabriel Gudmundsson", "Angel Gomes", "Osame Sahraoui"]},
  {n:"PSV", s:82, arena:"Philips Stadion", squad: ["Luuk de Jong", "Malik Tillman", "Noa Lang", "Johan Bakayoko", "Joey Veerman", "Jerdy Schouten", "Walter Benítez", "Olivier Boscagli"]},
  {n:"Feyenoord", s:80, arena:"De Kuip", squad: ["Santiago Giménez", "Igor Paixão", "Quinten Timber", "David Hancko", "Timon Wellenreuther", "Luka Ivanušec"]},
  {n:"Sporting", s:83, arena:"Estádio José Alvalade", squad: ["Luis Javier Suárez", "Gonçalo Inácio", "Pedro Gonçalves", "Morten Hjulmand", "Geovany Quenda", "Ousmane Diomande", "Francisco Trincão", "Franco Israel"]},
  {n:"Benfica", s:82, arena:"Estádio da Luz", squad: ["Ángel Di María", "Vangelis Pavlidis", "Orkun Kökçü", "Fredrik Aursnes", "Nicolás Otamendi", "Renato Sanches", "Anatoliy Trubin", "Alexander Bah"]},
  {n:"Club Brugge", s:78, arena:"Jan Breydel Stadium", squad: ["Andreas Skov Olsen", "Hans Vanaken", "Simon Mignolet", "Hugo Vetlesen", "Gustaf Nilsson"]},
  {n:"Celtic", s:77, arena:"Celtic Park", squad: ["Kyogo Furuhashi", "Callum McGregor", "Kasper Schmeichel", "Cameron Carter-Vickers", "Nicolas Kühn", "Reo Hatate"]},
  {n:"Sturm Graz", s:75, arena:"Merkur Arena", squad: ["Mika Biereth", "Otar Kiteishvili", "Kjell Scherpen", "Gregory Wüthrich"]},
  {n:"RB Salzburg", s:79, arena:"Red Bull Arena Salzburg", squad: ["Karim Konaté", "Oscar Gloukh", "Amar Dedić", "Janis Blaswich", "Mads Bidstrup"]},
  {n:"Estrela Vermelha", s:75, arena:"Rajko Mitić", squad: ["Cherif Ndiaye", "Mirko Ivanić", "Omri Glazer", "Uroš Spajić"]},
  {n:"Shakhtar Donetsk", s:78, arena:"Arena Lviv", squad: ["Georgiy Sudakov", "Danylo Sikan", "Dmytro Riznyk", "Mykola Matviyenko", "Eguinaldo"]},
  {n:"Dinamo Zagreb", s:76, arena:"Stadion Maksimir", squad: ["Bruno Petković", "Martin Baturina", "Ivan Nevistić", "Stefan Ristovski"]},
  {n:"Slovan Bratislava", s:72, arena:"Tehelné pole", squad: ["Tigran Barseghyan", "Dominik Takáč", "Juraj Kucka"]},
  {n:"Young Boys", s:74, arena:"Stadion Wankdorf", squad: ["Cedric Itten", "Filip Ugrinic", "David von Ballmoos", "Sandro Lauper"]},
  {n:"Sparta Praga", s:75, arena:"epet ARENA", squad: ["Veljko Birmančević", "Lukáš Haraslín", "Peter Vindahl Jensen", "Martin Vitík"]}
  ];


const WEATHERS = ["Chuva Forte ", "Neve Fria ", "Clima Ensolarado ", "Neblina Densa ", "Clima Agradável "];

const QUESTS_POOL = [
  { id: "garcom", title: " Garçom de Elite", desc: "Acumule 5 ou mais assistências com o mesmo jogador durante a campanha." },
  { id: "dono", title: " O Dono do Time", desc: "Faça com que seu Capitão termine como o maior artilheiro isolado do time." },
  { id: "hat", title: " Hat-Trick Hero", desc: "Marque 3 ou mais gols com o mesmo jogador em um único jogo do torneio." },
  { id: "raio", title: " O Raio da Rodada", desc: "Tenha Vinícius Júnior de titular e marque pelo menos 3 gols com ele na campanha." },
  { id: "robo", title: " Máquina de Gols", desc: "Tenha Cristiano Ronaldo de titular e marque um Hat-Trick (3 gols) com ele em um jogo." },
  { id: "muralha", title: " Muralha Branca", desc: "Termine o torneio sofrendo 4 gols ou menos no total." },
  { id: "galaticos", title: " DNA Galáctico", desc: "Escale pelo menos 3 jogadores com overall (OVR) igual ou maior que 90." },
  { id: "copero", title: " Casca Grossa", desc: "Tenha pelo menos 5 jogadores diferentes balançando as redes na campanha." },
  { id: "perfeito", title: " Impecável", desc: "Seja campeão vencendo todos os jogos no tempo regulamentar ou prorrogação (sem pênaltis)." },
  { id: "zaga_artilheira", title: " Defensor Artilheiro", desc: "Faça com que um Zagueiro (ZAG) ou Lateral (LD/LE) marque pelo menos 2 gols no torneio." },
  { id: "meio_ouro", title: " Meio-Campo de Ouro", desc: "Marque 4 ou mais gols no torneio somando apenas jogadores de MC/MEI/VOL." },
  { id: "sexto_homem", title: " Garçom de Trás", desc: "Tenha um defensor (ZAG, LD, LE) ou Volante (VOL) distribuindo pelo menos 3 assistências." },
  { id: "clean_sheet", title: " Retranca de Aço", desc: "Não sofra gols (Clean Sheets) em pelo menos 3 jogos da fase de grupos." },
  { id: "ataque_total", title: " Ataque Total", desc: "Faça com que seus 3 atacantes titulares marquem pelo menos 1 gol cada." },
  { id: "muro_zero", title: " Muro Impenetrável", desc: "Termine a campanha inteira sem sofrer nenhum gol sequer." },
  { id: "camisa_9", title: " Camisa 9 Letal", desc: "Faça o Centroavante (CA) titular marcar 6 gols ou mais somados na campanha." },
  { id: "show_goleadas", title: " Show de Goleadas", desc: "Vença pelo menos 2 jogos por diferença de 3 gols ou mais." },
  { id: "capitao_provedor", title: " Capitão Provedor", desc: "Faça seu Capitão distribuir 3 assistências ou mais durante a campanha." },
  { id: "lenda_absoluta", title: " Lenda Absoluta", desc: "Seja campeão da Champions League jogando na dificuldade Lendário." },
  { id: "final_blindada", title: " Final Blindada", desc: "Vença a Final da Champions League sem sofrer nenhum gol." },
  { id: "cartao_sujo", title: " Cartão Sujo", desc: "Acumule 10 ou mais cartões amarelos somados durante toda a campanha." },
  { id: "fair_play", title: " Fair Play Impecável", desc: "Termine a campanha inteira com 4 cartões amarelos ou menos." },
  { id: "dez_guerreiros", title: " Dez Guerreiros", desc: "Vença uma partida mesmo depois de sofrer um cartão vermelho." },
  { id: "capitao_de_ferro", title: " Capitão de Ferro", desc: "Seja campeão com um defensor (ZAG, LD, LE ou VOL) vestindo a braçadeira de capitão." },
  { id: "camisa10_magica", title: " Camisa 10 Mágica", desc: "Acumule 5 ou mais assistências somando apenas jogadores de MC/MEI." },
  { id: "heroi_penaltis", title: " Herói dos Pênaltis", desc: "Vença pelo menos um jogo do mata-mata nos pênaltis." },
  { id: "furia_visitante", title: " Fúria Visitante", desc: "Vença 4 ou mais jogos fora de casa (incluindo o mata-mata) durante a campanha." },
  { id: "fortaleza_bernabeu", title: " Fortaleza Bernabéu", desc: "Vença todos os seus jogos disputados em casa na fase de grupos." },
  { id: "sob_tempestade", title: " Sob Tempestade", desc: "Vença uma partida disputada sob chuva forte ou neve." },
  { id: "blindagem_final", title: " Blindagem de Elite", desc: "Não sofra gols na Semifinal e também na Final da Champions League." },
  { id: "volante_surpresa", title: " Volante Surpresa", desc: "Faça um Volante (VOL) marcar pelo menos 1 gol na campanha." },
  { id: "show_do_meia", title: " Show do Meia", desc: "Faça um jogador de Meia (MEI) marcar 3 gols ou mais sozinho na campanha." },
  { id: "campanha_relampago", title: " Campanha Relâmpago", desc: "Seja campeão jogando na velocidade Ultra Rápida." },
  { id: "investida_total", title: " Investida Total", desc: "Marque pelo menos 1 gol em todos os jogos da campanha, sem exceção." },
  { id: "show_de_talentos", title: " Show de Talentos", desc: "Escale um XI titular inteiro (11 jogadores) com overall (OVR) 85 ou superior." },
  { id: "artilheiro_imparavel", title: " Artilheiro Imparável", desc: "Faça um mesmo jogador marcar em 5 partidas consecutivas da campanha." },
  { id: "paredao_defensivo", title: " Paredão Defensivo", desc: "Faça seu Goleiro (GOL) conquistar pelo menos 3 prêmios de 'Homem do Jogo'." },
  { id: "artilheiro_longe", title: " Fuzilador de Longa Distância", desc: "Marque 4 gols ou mais chutando de fora da grande área na campanha." },
  { id: "artilheiro_primeiro_tempo", title: " Mordida Inicial", desc: "Marque gols em todos os primeiros tempos das partidas da fase de grupos." },
  { id: "goleada_relampago_2", title: " Chute no Estômago", desc: "Abra 3 a 0 no placar antes dos 25 minutos do primeiro tempo." },
  { id: "virada_epica", title: " Virada Épica", desc: "Vença uma partida de mata-mata após estar perdendo por 2 gols de diferença." },
  { id: "tiro_certo", title: " Mira a Laser", desc: "Termine uma partida com 100% de aproveitamento nos chutes a gol (mínimo 5 finalizações)." },
  { id: "pedra_no_sapato", title: " Pedra no Sapato", desc: "Elimine um rival tradicional ou time de maior overall nas quartas de final." },
  { id: "artilharia_pesada", title: " Artilharia Pesada", desc: "Marque 20 gols ou mais no somatório de toda a fase de grupos." },
  { id: "estreia_pe_direito", title: " Estreia com Pé Direito", desc: "Vença o primeiro jogo da fase de grupos por 3 gols ou mais de diferença." },
  { id: "coracao_valente", title: " Coração Valente", desc: "Vença uma partida jogando com um jogador a menos desde o primeiro tempo." },
  { id: "cabecaco_certeiro", title: " Cabeça de Aço", desc: "Marque 4 gols de cabeça com qualquer jogador durante a campanha." },
  { id: "canhao_longa_distancia", title: " Canhão de Fora da Área", desc: "Marque 3 gols ou mais chutando de fora da grande área na campanha." },
  { id: "caiu_na_rede", title: " Cabeça de Ouro", desc: "Marque 3 ou mais gols de cabeça durante toda a campanha." },
  { id: "fuzilaria", title: " Fuzilaria Total", desc: "Finalize a gol 15 vezes ou mais em uma única partida." },
  { id: "trator_grupao", title: " Trator na Fase de Grupos", desc: "Vença todos os 6 jogos da fase de grupos sem perder nenhum ponto." },
  { id: "principezinho", title: " Joia da Base", desc: "Escale um jogador com menos de 21 anos como titular em todas as partidas." },
  { id: "experiencia_pura", title: " Veterano de Guerra", desc: "Escale um jogador com 35 anos ou mais como titular na Grande Final." },
  { id: "festa_da_torcida", title: " Festa na Coxia", desc: "Marque 5 gols ou mais jogando com o uniforme reserva (fora de casa)." },
  { id: "dupla_infernal", title: " Dupla Infernal", desc: "Faça com que dois atacantes diferentes marquem 5 gols ou mais cada um." },
  { id: "goleada_historica", title: " Massacre Histórico", desc: "Vença uma partida oficial por uma diferença exata ou superior a 5 gols." },
  { id: "jogo_liso", title: " Jogo Limpo", desc: "Termine 3 partidas seguidas sem cometer nenhuma falta grave (sem cartões)." },
  { id: "carrasco_classicos", title: " Carrasco de Clássicos", desc: "Vença todos os jogos considerados clássicos ou dérbis na campanha." },
  { id: "salvador_patria", title: " Salvador da Pátria", desc: "Marque o gol da vitória (ou empate salvador) nos acréscimos do segundo tempo (após os 90')." },
  { id: "hat_trick_relampago", title: " Fúria Desenfreada", desc: "Faça um jogador marcar 3 gols em um intervalo de apenas 15 minutos de jogo." },
  { id: "muralha_aerea", title: " Muralha Aérea", desc: "Vença uma partida sem permitir que o adversário acerte nenhum chute no seu gol." },
  { id: "ponta_agressivo", title: " Ponta Incansável", desc: "Faça um Ponta Esquerda (PE) ou Direita (PD) acumular 8 participações em gols (gols + assistências)." },
  { id: "zagueiro_artilheiro_surpresa", title: " Artilheiro Improvável", desc: "Faça um Zagueiro (ZAG) marcar de cabeça após cobrança de escanteio." },
  { id: "pressao_alta", title: " Abafa o Caso", desc: "Marque um gol logo nos primeiros 5 minutos de partida." },
  { id: "bronze_ao_ouro", title: " Garimpo de Ouro", desc: "Escale um jogador com OVR abaixo de 80 e faça ele marcar um gol decisivo." },
  { id: "foco_total", title: " Foco na Missão", desc: "Vença um jogo de mata-mata sem realizar nenhuma alteração de posicionamento ou tática drástica." },
  { id: "mestre_tatico", title: " Mestre Tático", desc: "Vença uma partida após alterar a formação tática no intervalo." },
  { id: "invicto_mata", title: " Mata-Mata Imaculado", desc: "Passe pelas oitavas, quartas, semi e final sem perder nenhuma partida." },
  { id: "artilheiro_copas", title: " Dono da Final", desc: "Faça o mesmo jogador marcar 2 ou mais gols na partida da Grande Final." },
  { id: "ritmo_frenetico", title: " Ritmo Frenético", desc: "Participe de uma partida com 5 gols ou mais marcados no total (ambos os times)." },
  { id: "coroacao_perfeita", title: " Coroação Perfeita", desc: "Levante a taça de campeão vencendo a final por 3 gols ou mais de diferença." },
];

let activeQuests = [];

let xi = [];
let usedNames = new Set();
let currentRoll = null;
let pickedThisRound = false; 
let captainIdx = null;
let penaltyIdx = null;
let freekickIdx = null;

let statsCampaign = { wins: 0, gf: 0, ga: 0, perfect: true };
let scorers = {}; 
let assisters = {}; 
let campaignOpponents = [];
let isEliminated = false;
let currentStageIndex = 0;

// CONTROLES DA CAMPANHA
let globalWins = 0;
let globalGf = 0;
let globalGa = 0;
let globalPerfect = true;
let totalCleanSheets = 0;
let goleadasCount = 0;
let finalCleanSheet = false;
let totalYellowCards = 0;
let wonMatchWithRedCard = false;
let awayWins = 0;
let homePerfect = true;
let toughWeatherWin = false;
let cleanSheetSemi = false;
let wonViaPenalties = false;
let allMatchesScored = true;

// --- NOVOS CONTROLES PARA AS MISSÕES EXTRAS ---
let scoringStreaks = {};        // sequência atual de partidas seguidas marcando, por jogador
let maxScoringStreak = 0;       // maior sequência atingida na campanha
let longShotGoalsTotal = 0;     // gols de fora da área (campanha toda)
let headerGoalsTotal = 0;       // gols de cabeça (campanha toda)
let groupStageGoalsTotal = 0;   // gols marcados somando toda a fase de grupos
let groupFirstHalfAllScored = true; // marcou no 1º tempo em TODOS os jogos da fase de grupos
let groupStagePerfectWins = true;   // venceu todos os 6 jogos da fase de grupos
let hadRushedThreeNil = false;      // abriu 3x0 antes dos 25 min
let hadEpicComeback = false;        // reverteu desvantagem de 2+ gols numa eliminatória e venceu
let hadPerfectShooting = false;     // 100% de aproveitamento nos chutes a gol (mín. 5)
let beatStrongRivalQuartas = false; // eliminou rival forte/tradicional nas quartas
let wonFirstMatchBig = false;       // venceu a estreia da fase de grupos por 3+ gols
let wonWithRedCardFirstHalf = false;// venceu com um a menos desde o 1º tempo
let hadFiveGoalDiffWin = false;     // venceu por 5+ gols de diferença
let hadFiveGoalMatch = false;       // partida com 5+ gols somados (os dois times)
let hadEarlyGoal = false;           // gol marcado nos primeiros 5 minutos de alguma partida
let awayGoalsTotal = 0;             // gols marcados jogando fora de casa
let maxNoCardStreak = 0;            // sequência de partidas seguidas sem cartão
let currentNoCardStreak = 0;
let classicMatchesPlayed = 0;       // jogos contra rivais clássicos
let classicMatchesWon = 0;
let hadStoppageTimeSavior = false;  // gol salvador nos acréscimos
let hadRapidHatTrick = false;       // hat-trick em até 15 minutos
let hadMuralhaAerea = false;        // venceu sem sofrer nenhum chute no alvo
let hadFuzilaria = false;           // 15+ finalizações no alvo numa única partida
let zagHeaderCornerGoal = false;    // zagueiro marcou de cabeça após escanteio
let playedFinalMatch = false;       // chegou a disputar a Grande Final
let noLossInKnockoutFromOitavas = true; // não perdeu nenhuma partida das oitavas em diante
let wonFinalBig = false;            // foi campeão vencendo a final por 3+ gols
let dono_da_finalFlag = false;      // mesmo jogador marcou 2+ gols na final
let underdogDecisiveGoal = false;   // jogador OVR < 80 marcou gol numa vitória
let madeHalftimeChangeAndWon = false;  // venceu após "mexida tática" no intervalo
let wonKnockoutWithoutHalftimeChange = false; // venceu mata-mata sem mexida tática

function resetExtraQuestTrackers() {
  scoringStreaks = {};
  maxScoringStreak = 0;
  longShotGoalsTotal = 0;
  headerGoalsTotal = 0;
  groupStageGoalsTotal = 0;
  groupFirstHalfAllScored = true;
  groupStagePerfectWins = true;
  hadRushedThreeNil = false;
  hadEpicComeback = false;
  hadPerfectShooting = false;
  beatStrongRivalQuartas = false;
  wonFirstMatchBig = false;
  wonWithRedCardFirstHalf = false;
  hadFiveGoalDiffWin = false;
  hadFiveGoalMatch = false;
  hadEarlyGoal = false;
  awayGoalsTotal = 0;
  maxNoCardStreak = 0;
  currentNoCardStreak = 0;
  classicMatchesPlayed = 0;
  classicMatchesWon = 0;
  hadStoppageTimeSavior = false;
  hadRapidHatTrick = false;
  hadMuralhaAerea = false;
  hadFuzilaria = false;
  zagHeaderCornerGoal = false;
  playedFinalMatch = false;
  noLossInKnockoutFromOitavas = true;
  wonFinalBig = false;
  dono_da_finalFlag = false;
  underdogDecisiveGoal = false;
  madeHalftimeChangeAndWon = false;
  wonKnockoutWithoutHalftimeChange = false;
}

const stageTimeline = [
  { name: "Fase de Grupos · Rodada 1", knockout: false, home: true },
  { name: "Fase de Grupos · Rodada 2", knockout: false, home: false },
  { name: "Fase de Grupos · Rodada 3", knockout: false, home: true },
  { name: "Fase de Grupos · Rodada 4", knockout: false, home: false },
  { name: "Fase de Grupos · Rodada 5", knockout: false, home: true },
  { name: "Fase de Grupos · Rodada 6", knockout: false, home: false },
  { name: "Pré-Oitavas (Repescagem)", knockout: true, home: false, twoLegged: true },
  { name: "Oitavas de Final", knockout: true, home: false, twoLegged: true },
  { name: "Quartas de Final", knockout: true, home: false, twoLegged: true },
  { name: "Semifinal", knockout: true, home: false, twoLegged: true },
  { name: "Final de Champions", knockout: true, home: false, twoLegged: false }
];

let groupTeamsStats = [];
let maxGoalsSingleGame = 0;
let maxGoalsSingleGamePlayer = {}; // Track goals by player in individual games for quests
let motmCounts = {}; // Craques da Partida acumulados na campanha
let pendingTie = null; // Estado do confronto de ida e volta: {aggMy, aggOpp} após o jogo de ida

const squadsBox=document.getElementById('squadsBox'), xiBox=document.getElementById('xiBox');
const rollBtn=document.getElementById('rollBtn'), resetBtn=document.getElementById('resetBtn');
const simBtn=document.getElementById('simBtn'), simPanel=document.getElementById('simPanel');
const rolesPanel=document.getElementById('rolesPanel');
const matchesBox=document.getElementById('matchesBox'), resultBox=document.getElementById('result');
const hudW=document.getElementById('hudW'), hudGF=document.getElementById('hudGF'), hudGA=document.getElementById('hudGA');
const roundTag=document.getElementById('roundTag'), lockMsg=document.getElementById('lockMsg');
const pitchWrap=document.getElementById('pitchWrap');
const captainList=document.getElementById('captainList'), penaltyList=document.getElementById('penaltyList'), freekickList=document.getElementById('freekickList');
const groupStageContainer=document.getElementById('groupStageContainer');
const bracketContainer=document.getElementById('bracketContainer');
const difficultySelect=document.getElementById('difficultySelect');
const speedSelect=document.getElementById('speedSelect'); 
const draftModeSelect=document.getElementById('draftModeSelect');
const tacticLabel=document.getElementById('tacticLabel');

const matchControlRow=document.getElementById('matchControlRow');
const nextMatchBtn=document.getElementById('nextMatchBtn');

const aboutSection=document.getElementById('aboutSection');
const gameplayContainer=document.getElementById('gameplayContainer');

// ============================================================================
// SIMULADOR DE MOCK DE LOGIN / SALAS (MANTIDO PARA PROVAR DESIGN)
// ============================================================================
function handleLoginSubmit() {
  const username = document.getElementById('usernameInput').value.trim();
  if (!username) {
    alert("Digite seu nome aí, mermão!");
    return;
  }
  document.getElementById('authForm').classList.add('hidden');
  document.getElementById('loggedProfile').classList.remove('hidden');
  document.getElementById('profileName').textContent = username;
}

function handleLogout() {
  document.getElementById('authForm').classList.remove('hidden');
  document.getElementById('loggedProfile').classList.add('hidden');
  document.getElementById('multiplayerStatus').textContent = "";
}

function handleCreateRoom() {
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  document.getElementById('multiplayerStatus').innerHTML = ` Sala <b>#${randomCode}</b> criada!<br>Chamando adversário para conectar... 🕒<br><span style="font-size:9.5px;color:var(--muted);">(Aguardando conexão real de banco de dados WebSocket/Node.js)</span>`;
}

function handleJoinRoom() {
  const code = document.getElementById('roomCodeInput').value.trim();
  if(!code) {
    alert("Coloca o código da sala de 4 dígitos aí, meu camarada!");
    return;
  }
  document.getElementById('multiplayerStatus').innerHTML = ` Conectando na sala <b>#${code}</b>...<br>Pronto! Draft compartilhado simulado! 🚀`;
}

function startDraftFlow(){
  aboutSection.classList.add('hidden');
  gameplayContainer.classList.remove('hidden');
  randomizeTactic();
  renderXI();
  generateActiveQuests();
  window.scrollTo({ top: gameplayContainer.offsetTop - 20, behavior: 'smooth' });
}

function filledCount(){ return xi.filter(x=>x!==null).length; }

function randomizeTactic() {
  const tacticsKeys = Object.keys(TACTICS_DB);
  activeTacticName = tacticsKeys[Math.floor(Math.random() * tacticsKeys.length)];
  FORMATION = [...TACTICS_DB[activeTacticName].formation];
  COORDS = [...TACTICS_DB[activeTacticName].coords];
  tacticLabel.textContent = activeTacticName;
  xi = new Array(FORMATION.length).fill(null);
}

function generateActiveQuests() {
  const shuffled = [...QUESTS_POOL].sort(() => Math.random() - 0.5);
  activeQuests = shuffled.slice(0, 5);
  
  const container = document.getElementById('questsBox');
  container.innerHTML = '';
  
  activeQuests.forEach(q => {
    const card = document.createElement('div');
    card.className = 'quest-card';
    card.id = `q-${q.id}`;
    card.innerHTML = `
      <div class="quest-info">
        <h4>${q.title}</h4>
        <p>${q.desc}</p>
      </div>
      <span class="quest-status pending" id="s-${q.id}">Pendente</span>
    `;
    container.appendChild(card);
  });
}

function renderPitch(){
  pitchWrap.innerHTML = `
    <svg viewBox="0 0 100 145" preserveAspectRatio="none">
      <rect width="100" height="145" fill="#050505"/>
      <rect width="100" height="145" fill="url(#stripes)"/>
      <defs>
        <pattern id="stripes" width="20" height="145" patternUnits="userSpaceOnUse">
          <rect width="10" height="145" fill="rgba(255,255,255,0.01)"/>
        </pattern>
      </defs>
      <g stroke="rgba(255,255,255,.2)" stroke-width="0.6" fill="none">
        <rect x="3" y="3" width="94" height="139"/>
        <line x1="3" y1="72.5" x2="97" y2="72.5"/>
        <circle cx="50" cy="72.5" r="12"/>
        <rect x="25" y="3" width="50" height="20"/>
        <rect x="25" y="122" width="50" height="20"/>
        <rect x="38" y="3" width="24" height="8"/>
        <rect x="38" y="134" width="24" height="8"/>
        <circle cx="50" cy="18" r="0.8" fill="rgba(255,255,255,.3)"/>
        <circle cx="50" cy="127" r="0.8" fill="rgba(255,255,255,.3)"/>
      </g>
    </svg>`;
  FORMATION.forEach((pos,i)=>{
    const [x,y] = COORDS[i];
    const dot = document.createElement('div');
    const filled = xi[i] !== null;
    dot.className = 'pdot' + (filled ? '' : ' empty') + (captainIdx===i ? ' captain' : '');
    dot.style.left = x+'%'; dot.style.top = y+'%';
    dot.textContent = filled ? initials(xi[i].n) : pos;
    if (filled && captainIdx===i) {
      const c = document.createElement('div'); c.className='badge-c'; c.textContent='C'; dot.appendChild(c);
    }
    if (filled && penaltyIdx===i) {
      const p = document.createElement('div'); p.className='badge-p'; p.textContent='⚽'; dot.appendChild(p);
    }
    if (filled && freekickIdx===i) {
      const f = document.createElement('div'); f.className='badge-f'; f.textContent='F'; dot.appendChild(f);
    }
    pitchWrap.appendChild(dot);
  });
}

function initials(name){
  const parts = name.split(' ').filter(w=>w.length>1);
  if (parts.length===1) return parts[0].slice(0,3).toUpperCase();
  return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
}

function checkNoFits(roll) {
  if (!roll) return false;
  let hasFit = false;
  roll.forEach(squadName => {
    SQUADS[squadName].forEach(pl => {
      const alreadyUsed = usedNames.has(pl.n);
      const slotLeft = FORMATION.some((pos, i) => pos === pl.p && xi[i] === null);
      if (!alreadyUsed && slotLeft) {
        hasFit = true;
      }
    });
  });
  return !hasFit;
}

function renderXI(){
  xiBox.innerHTML = '';
  FORMATION.forEach((pos,i)=>{
    const slot = document.createElement('div');
    slot.className = 'slot' + (xi[i] ? ' filled' : '');
    if (xi[i]) {
      const capTag = captainIdx===i ? ' (C)' : '';
      const penTag = penaltyIdx===i ? ' (P)' : '';
      const fkTag = freekickIdx===i ? ' (F)' : '';
      const displayOvr = (draftModeSelect.value === 'almanac' && filledCount() < 11) ? '?' : xi[i].ovr;
      
      const alternativePositions = xi[i].roles ? xi[i].roles.filter(role => role !== pos && FORMATION.some((fPos, fIdx) => fPos === role && xi[fIdx] === null)) : [];
      let swapBtnHtml = '';
      if(alternativePositions.length > 0 && filledCount() < 11) {
        swapBtnHtml = `<button class="swap-btn" onclick="movePlayer(${i})">Mover</button>`;
      }

      slot.innerHTML = `
        <div class="tag">${pos}</div>
        <div class="name">${xi[i].n}${capTag}${penTag}${fkTag}</div>
        <div class="meta">${POS_LABEL[pos]} · ${displayOvr}</div>
        <div class="from">${xi[i].from}</div>
        ${swapBtnHtml}
      `;
    } else {
      slot.innerHTML = `<div class="tag">${pos}</div><div class="meta">${POS_LABEL[pos]}</div>`;
    }
    xiBox.appendChild(slot);
  });
  renderPitch();
  const done = filledCount();
  roundTag.textContent = done>=11 ? 'Time completo!' : `Rodada ${done+1} de 11`;
  
  rollBtn.disabled = done>=11 || (pickedThisRound===false && currentRoll!==null && !checkNoFits(currentRoll));
  
  if (done>=11) {
    rolesPanel.classList.remove('hidden');
    renderRoleLists();
  } else {
    rolesPanel.classList.add('hidden');
  }
  updateSimBtn();
}

function movePlayer(index) {
  const player = xi[index];
  if(!player || !player.roles) return;
  const targetPos = player.roles.find(role => FORMATION.some((fPos, fIdx) => fPos === role && xi[fIdx] === null));
  if(!targetPos) return;
  
  const targetIndex = FORMATION.findIndex((fPos, fIdx) => fPos === targetPos && xi[fIdx] === null);
  if(targetIndex !== -1) {
    const wasCaptain = captainIdx === index;
    const wasPenalty = penaltyIdx === index;
    const wasFreekick = freekickIdx === index;

    xi[targetIndex] = { ...player, p: targetPos };
    xi[index] = null;

    if (wasCaptain) captainIdx = targetIndex;
    if (wasPenalty) penaltyIdx = targetIndex;
    if (wasFreekick) freekickIdx = targetIndex;

    lockMsg.textContent = `${player.n} foi deslocado para a posição de ${POS_LABEL[targetPos]}!`;
    renderXI();
    if(currentRoll) renderSquads(currentRoll);
  }
}

function updateSimBtn(){
  simBtn.disabled = !(filledCount()===11 && captainIdx!==null && penaltyIdx!==null && freekickIdx!==null) || isEliminated;
  if(isEliminated) {
    simBtn.textContent = "Eliminado! Recomece o Time";
  } else {
    simBtn.textContent = "Iniciar campanha";
  }
}

function renderRoleLists(){
  captainList.innerHTML=''; penaltyList.innerHTML=''; freekickList.innerHTML='';
  xi.forEach((pl,i)=>{
    const capChip = document.createElement('div');
    capChip.className = 'pick-chip' + (captainIdx===i ? ' selected' : '');
    capChip.textContent = `${pl.n} · ${pl.p}`;
    capChip.onclick = () => { captainIdx = i; renderXI(); };
    captainList.appendChild(capChip);

    const penChip = document.createElement('div');
    penChip.className = 'pick-chip' + (penaltyIdx===i ? ' selected' : '');
    penChip.textContent = `${pl.n} · ${pl.p}`;
    penChip.onclick = () => { penaltyIdx = i; renderXI(); };
    penaltyList.appendChild(penChip);

    const fkChip = document.createElement('div');
    fkChip.className = 'pick-chip' + (freekickIdx===i ? ' selected' : '');
    fkChip.textContent = `${pl.n} · ${Math.round(getFreekickProb(pl) * 100)}%`;
    fkChip.onclick = () => { freekickIdx = i; renderXI(); };
    freekickList.appendChild(fkChip);
  });
}

function renderSquads(roll){
  squadsBox.innerHTML = '';
  if (!roll) return;
  
  const noMatches = checkNoFits(roll);
  if (noMatches) {
    lockMsg.textContent = "Nenhum jogador deste ano serve nas sua(s) posições restantes! Rolar elenco novamente.";
    rollBtn.disabled = false;
  }

  roll.forEach(squadName=>{
    const card = document.createElement('div');
    card.className = 'squad-card';
    card.innerHTML = `<h3>${squadName}</h3>`;
    SQUADS[squadName].forEach(pl=>{
      const alreadyUsed = usedNames.has(pl.n);
      const noSlotLeft = !FORMATION.some((pos,i)=>pos===pl.p && xi[i]===null);
      const disabled = alreadyUsed || noSlotLeft || pickedThisRound;
      const row = document.createElement('div');
      row.className = 'player' + (disabled ? ' disabled' : '');
      const star = pl.ovr>=90 ? '<span class="star">★</span>' : '';
      
      const displayOvr = (draftModeSelect.value === 'almanac') ? '?' : pl.ovr;
      
      row.innerHTML = `<span><span class="pos">${pl.p}</span>${pl.n}${star}</span><span class="ovr">${displayOvr}</span>`;
      if (!disabled) row.onclick = () => pickPlayer(pl, squadName, roll);
      card.appendChild(row);
    });
    squadsBox.appendChild(card);
  });
}

function pickPlayer(pl, squadName, roll){
  if (pickedThisRound) return;
  const slotIdx = FORMATION.findIndex((pos,i)=>pos===pl.p && xi[i]===null);
  if (slotIdx===-1) return;
  xi[slotIdx] = {...pl, from: squadName};
  usedNames.add(pl.n);
  pickedThisRound = true;
  rollBtn.disabled = filledCount()>=11;
  renderXI();
  renderSquads(roll);
  lockMsg.textContent = `${pl.n} escalado como ${POS_LABEL[pl.p]}. Role de novo para as posições abertas.`;
}

function rollSquads(){
  if (filledCount()>=11) return;
  
  if (currentRoll !== null && !pickedThisRound && !checkNoFits(currentRoll)) {
    return;
  }
  
  const names = Object.keys(SQUADS);
  const pick = names[Math.floor(Math.random()*names.length)];
  currentRoll = [pick];
  pickedThisRound = false;
  lockMsg.textContent = '';
  renderSquads(currentRoll);
  
  if (!checkNoFits(currentRoll)) {
    rollBtn.disabled = true; 
  }
}

rollBtn.onclick = rollSquads;

resetBtn.onclick = () => {
  randomizeTactic();
  usedNames.clear();
  currentRoll = null;
  pickedThisRound = false;
  captainIdx = null;
  penaltyIdx = null;
  freekickIdx = null;
  scorers = {};
  assisters = {}; 
  isEliminated = false;
  campaignOpponents = [];
  groupPoints = 0;
  currentStageIndex = 0;
  globalWins = 0;
  globalGf = 0;
  globalGa = 0;
  globalPerfect = true;
  totalCleanSheets = 0;
  goleadasCount = 0;
  finalCleanSheet = false;
  totalYellowCards = 0;
  wonMatchWithRedCard = false;
  awayWins = 0;
  homePerfect = true;
  toughWeatherWin = false;
  cleanSheetSemi = false;
  wonViaPenalties = false;
  allMatchesScored = true;
  groupTeamsStats = [];
  maxGoalsSingleGame = 0;
  maxGoalsSingleGamePlayer = {};
  motmCounts = {};
  pendingTie = null;
  resetExtraQuestTrackers();
  squadsBox.innerHTML = '';
  lockMsg.textContent = '';
  rollBtn.disabled = false;
  renderXI();
  generateActiveQuests();
  simPanel.classList.add('hidden');
  rolesPanel.classList.add('hidden');
  matchesBox.innerHTML = '';
  resultBox.classList.add('hidden');
  resultBox.classList.remove('perfect');
  groupStageContainer.innerHTML = '';
  bracketContainer.innerHTML = '';
  matchControlRow.classList.add('hidden');
  hudW.textContent = 0; hudGF.textContent = 0; hudGA.textContent = 0;
  statsCampaign = { wins: 0, gf: 0, ga: 0, perfect: true };
};

draftModeSelect.onchange = () => {
  if (filledCount() > 0) {
    alert("O draft já começou! Reinicie para alterar o modo de jogo.");
    draftModeSelect.value = draftModeSelect.value === 'classic' ? 'almanac' : 'classic';
  } else {
    renderXI();
  }
};

function teamStrength(){ return xi.reduce((s,p)=>s+p.ovr,0)/xi.length; }

function poisson(lambda){
  const safeLambda = Math.max(lambda,0.05);
  const L = Math.exp(-safeLambda);
  let k=0,p=1;
  do { k++; p*=Math.random(); } while (p>L && k<12);
  return k-1;
}

function simulateMatch(myStrength, opp, homeMatch = true, minutes = 90){
  let diff = (myStrength - opp.s)/10;
  const diffMode = difficultySelect.value;
  
  let ratio = minutes / 90;
  
  let baseMyLambda = 1.35 * ratio;
  let baseOppLambda = 1.15 * ratio;

  if (!homeMatch) {
    baseMyLambda -= 0.15 * ratio;
    baseOppLambda += 0.15 * ratio;
  }
  
  if (diffMode === "easy") {
    baseMyLambda += 0.4 * ratio;
    baseOppLambda -= 0.4 * ratio;
  } else if (diffMode === "hard") {
    baseMyLambda -= 0.2 * ratio;
    baseOppLambda += 0.2 * ratio;
  } else if (diffMode === "champion") {
    baseMyLambda -= 0.5 * ratio;
    baseOppLambda += 0.6 * ratio; 
  }

  const myGoals = Math.max(0, poisson(baseMyLambda + diff * 0.6 * ratio));
  const oppGoals = Math.max(0, poisson(baseOppLambda - diff * 0.5 * ratio));
  return { myGoals, oppGoals };
}

// DISTRIBUIÇÃO DOS GOLS DO REAL MADRID E REGISTRO DE ASSISTÊNCIAS
function distributeGoals(goalsCount, startMin = 1, endMin = 90, matchScorersTracker = {}) {
  if (goalsCount <= 0) return [];
  const weights = { CA: 10, PE: 8, PD: 8, MEI: 5, MC: 4, SA: 9, ME: 6, MD: 6, VOL: 2, LD: 1, LE: 1, GOL: 0 };
  const HEADER_CHANCE = { CA: 0.22, SA: 0.18, ZAG: 0.20, PE: 0.10, PD: 0.10, MEI: 0.08, MC: 0.06, ME: 0.09, MD: 0.09, VOL: 0.07, LD: 0.06, LE: 0.06, GOL: 0 };
  const LONGSHOT_CHANCE = { MC: 0.20, MEI: 0.18, VOL: 0.15, ME: 0.14, MD: 0.14, PE: 0.12, PD: 0.12, SA: 0.10, CA: 0.06, ZAG: 0.05, LD: 0.06, LE: 0.06, GOL: 0 };
  const candidates = [];
  
  xi.forEach((pl, idx) => {
    if (pl) {
      const pos = FORMATION[idx];
      const weight = weights[pos] || 1;
      for (let w = 0; w < weight; w++) {
        candidates.push(pl.n);
      }
    }
  });

  const matchScorers = [];
  const penaltyTakerName = penaltyIdx !== null && xi[penaltyIdx] ? xi[penaltyIdx].n : null;
  const freekickTaker = freekickIdx !== null ? xi[freekickIdx] : null;
  const freekickTakerName = freekickTaker ? freekickTaker.n : null;
  const freekickGoalChance = freekickTaker ? getFreekickProb(freekickTaker) * 0.3 : 0;

  for (let g = 0; g < goalsCount; g++) {
    const isPenaltyGoal = Math.random() < 0.15;
    const isFreekickGoal = !isPenaltyGoal && freekickTakerName && Math.random() < freekickGoalChance;
    let selectedPlayer;

    if (isPenaltyGoal && penaltyTakerName) {
      selectedPlayer = penaltyTakerName;
    } else if (isFreekickGoal) {
      selectedPlayer = freekickTakerName;
    } else {
      selectedPlayer = candidates[Math.floor(Math.random() * candidates.length)] || "Real Madrid";
    }

    let selectedAssister = null;
    if (!isPenaltyGoal && !isFreekickGoal && Math.random() < 0.70) {
      const potentialAssisters = xi.filter(pl => pl && pl.n !== selectedPlayer && FORMATION[xi.indexOf(pl)] !== 'GOL');
      if (potentialAssisters.length > 0) {
        selectedAssister = potentialAssisters[Math.floor(Math.random() * potentialAssisters.length)].n;
        assisters[selectedAssister] = (assisters[selectedAssister] || 0) + 1;
      }
    }

    // Classifica o tipo do gol (cabeça / fora da área) com base na posição do artilheiro,
    // para alimentar as missões de "gols de cabeça" e "gols de longa distância".
    let isHeader = false, isLongShot = false;
    if (!isPenaltyGoal && !isFreekickGoal) {
      const scorerIdx = xi.findIndex(pl => pl && pl.n === selectedPlayer);
      const scorerPos = scorerIdx !== -1 ? FORMATION[scorerIdx] : null;
      const headerChance = HEADER_CHANCE[scorerPos] ?? 0.10;
      const longshotChance = LONGSHOT_CHANCE[scorerPos] ?? 0.08;
      const roll = Math.random();
      if (roll < headerChance) {
        isHeader = true;
        headerGoalsTotal++;
      } else if (roll < headerChance + longshotChance) {
        isLongShot = true;
        longShotGoalsTotal++;
      }
      if (isHeader && scorerPos === 'ZAG' && selectedAssister) {
        zagHeaderCornerGoal = true;
      }
    }

    matchScorers.push({
      name: selectedPlayer,
      assister: selectedAssister,
      minute: Math.floor(Math.random() * (endMin - startMin + 1)) + startMin,
      isPenalty: isPenaltyGoal,
      isFreekick: isFreekickGoal,
      isHeader,
      isLongShot
    });
    
    scorers[selectedPlayer] = (scorers[selectedPlayer] || 0) + 1;
    matchScorersTracker[selectedPlayer] = (matchScorersTracker[selectedPlayer] || 0) + 1;
  }

  for (let plName in matchScorersTracker) {
    if (matchScorersTracker[plName] > maxGoalsSingleGame) {
      maxGoalsSingleGame = matchScorersTracker[plName];
    }
    maxGoalsSingleGamePlayer[plName] = Math.max(maxGoalsSingleGamePlayer[plName] || 0, matchScorersTracker[plName]);
  }

  return matchScorers.sort((a, b) => a.minute - b.minute);
}

// DISTRIBUIÇÃO DOS GOLS DO ADVERSÁRIO (EXPANDIDO)
function distributeOpponentGoals(opp, goalsCount, startMin = 1, endMin = 90) {
  if (goalsCount <= 0) return [];
  const oppScorers = [];
  const squad = opp.squad || ["Jogador Oponente"];
  
  for (let g = 0; g < goalsCount; g++) {
    const selectedPlayer = squad[Math.floor(Math.random() * squad.length)];
    const isPenaltyGoal = Math.random() < 0.15;
    
    let selectedAssister = null;
    if (!isPenaltyGoal && Math.random() < 0.65) {
      const potentialAssisters = squad.filter(name => name !== selectedPlayer);
      if (potentialAssisters.length > 0) {
        selectedAssister = potentialAssisters[Math.floor(Math.random() * potentialAssisters.length)];
      }
    }

    oppScorers.push({
      name: selectedPlayer,
      assister: selectedAssister,
      minute: Math.floor(Math.random() * (endMin - startMin + 1)) + startMin,
      isPenalty: isPenaltyGoal
    });
  }
  return oppScorers.sort((a, b) => a.minute - b.minute);
}

function simulateShootout(myStrength, oppStrength, takerOvr){
  const baseP = 0.72 + (takerOvr-85)/300 + (myStrength-oppStrength)/400;
  const p = Math.min(0.88, Math.max(0.55, baseP));
  const oppP = 0.74;
  let myScore=0, oppScore=0, myKicks=[], oppKicks=[], rounds=0;
  while (rounds<5 || myScore===oppScore) {
    const mHit = Math.random()<p; const oHit = Math.random()<oppP;
    myKicks.push(mHit); oppKicks.push(oHit);
    if (mHit) myScore++; if (oHit) oppScore++;
    rounds++;
    if (rounds>=15) break;
  }
  return { myScore, oppScore, myKicks, oppKicks, win: myScore>oppScore };
}

function selectCampaignOpponents() {
  const pool = [...OPPONENTS].sort(() => Math.random() - 0.5);
  const groupOpponents = pool.slice(0, 3);
  
  const schedule = [
    groupOpponents[0],
    groupOpponents[1],
    groupOpponents[2],
    groupOpponents[0],
    groupOpponents[1],
    groupOpponents[2],
  ];

  const knockoutOpponents = pool.slice(3, 8); 
  return schedule.concat(knockoutOpponents);
}

function initGroupStandings(opponents) {
  groupTeamsStats = [
    { name: "Real Madrid (Você)", pts: 0, gp: 0, gc: 0, sg: 0, isUser: true },
    { name: opponents[0].n, pts: 0, gp: 0, gc: 0, sg: 0, isUser: false, s: opponents[0].s },
    { name: opponents[1].n, pts: 0, gp: 0, gc: 0, sg: 0, isUser: false, s: opponents[1].s },
    { name: opponents[2].n, pts: 0, gp: 0, gc: 0, sg: 0, isUser: false, s: opponents[2].s }
  ];
}

function simulateRivalMatches(roundIndex) {
  let t1, t2;
  if (roundIndex === 0) { t1 = groupTeamsStats[2]; t2 = groupTeamsStats[3]; }
  else if (roundIndex === 1) { t1 = groupTeamsStats[1]; t2 = groupTeamsStats[3]; }
  else if (roundIndex === 2) { t1 = groupTeamsStats[1]; t2 = groupTeamsStats[2]; }
  else if (roundIndex === 3) { t1 = groupTeamsStats[3]; t2 = groupTeamsStats[2]; }
  else if (roundIndex === 4) { t1 = groupTeamsStats[3]; t2 = groupTeamsStats[1]; }
  else { t1 = groupTeamsStats[2]; t2 = groupTeamsStats[1]; }

  const diff = (t1.s - t2.s) / 10;
  const goal1 = Math.max(0, poisson(1.25 + diff * 0.4));
  const goal2 = Math.max(0, poisson(1.25 - diff * 0.4));

  t1.gp += goal1; t1.gc += goal2; t1.sg = t1.gp - t1.gc;
  t2.gp += goal2; t2.gc += goal1; t2.sg = t2.gp - t2.gc;

  if (goal1 > goal2) {
    t1.pts += 3;
  } else if (goal1 < goal2) {
    t2.pts += 3;
  } else {
    t1.pts += 1;
    t2.pts += 1;
  }
}

function updateGroupTableLive(opponents, userGoals, oppGoals, opponentIndex, roundIndex) {
  const userRow = groupTeamsStats.find(t => t.isUser);
  userRow.gp += userGoals;
  userRow.gc += oppGoals;
  userRow.sg = userRow.gp - userRow.gc;
  if (userGoals > oppGoals) {
    userRow.pts += 3;
  } else if (userGoals === oppGoals) {
    userRow.pts += 1;
  }

  const oppRow = groupTeamsStats.find(t => t.name === opponents[opponentIndex].n);
  oppRow.gp += oppGoals;
  oppRow.gc += userGoals;
  oppRow.sg = oppRow.gp - oppRow.gc;
  if (oppGoals > userGoals) {
    oppRow.pts += 3;
  } else if (oppGoals === userGoals) {
    oppRow.pts += 1;
  }

  simulateRivalMatches(roundIndex);

  groupTeamsStats.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.sg !== a.sg) return b.sg - a.sg;
    return b.gp - a.gp;
  });

  let qualification = "Disputando a Fase de Grupos (6 Rodadas)...";
  const myRank = groupTeamsStats.findIndex(t => t.isUser) + 1;
  
  if (roundIndex >= 5) { 
    if (myRank === 1) {
      qualification = "<span style='color: #96731f'>Classificado! (G1) — Oitavas de Final!</span>";
    } else if (myRank === 2) {
      qualification = "<span style='color: #96731f'>Classificado! (G2) — Oitavas de Final!</span>";
    } else if (myRank === 3) {
      qualification = "<span style='color: #96731f'>Vaga na Pré-Oitavas (Repescagem)!</span>";
    } else {
      qualification = "<span style='color: #ff3b30'>Eliminado na Fase de Grupos!</span>";
      isEliminated = true;
    }
  }

  groupStageContainer.innerHTML = `
    <h3 style="font-family:'Space Mono',monospace; font-size:11px; color:var(--gold-bright); margin:10px 0 4px">Tabela do Grupo</h3>
    <table class="standings-table">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Time</th>
          <th>Pts</th>
          <th>SG</th>
          <th>GP</th>
          <th>GC</th>
        </tr>
      </thead>
      <tbody>
        ${groupTeamsStats.map((t, idx) => `
          <tr class="${t.isUser ? 'highlight' : ''} ${(roundIndex >= 5 && idx >= 3) ? 'eliminated' : ''}">
            <td>${idx + 1}</td>
            <td>${t.name}</td>
            <td>${t.pts}</td>
            <td>${t.sg > 0 ? '+' + t.sg : t.sg}</td>
            <td>${t.gp}</td>
            <td>${t.gc}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p style="font-size: 11px; text-align: center; font-weight: bold; margin-bottom: 10px;">${qualification}</p>
  `;
}

function renderBracket(stageName, opponentName, currentMatchScore) {
  if (!bracketContainer.innerHTML || stageName === "Pré-Oitavas (Repescagem)") {
    bracketContainer.innerHTML = `
      <h3 style="font-family:'Space Mono',monospace; font-size:11px; color:var(--gold-bright); margin:10px 0 4px">Chaveamento do Mata-Mata</h3>
      <div class="bracket">
        <div class="bracket-round">
          <h4>Pré-Oitavas</h4>
          <div class="bracket-match" id="bracket-pre-oitavas">...</div>
        </div>
        <div class="bracket-round">
          <h4>Oitavas</h4>
          <div class="bracket-match" id="bracket-oitavas">Real Madrid vs ...</div>
        </div>
        <div class="bracket-round">
          <h4>Quartas</h4>
          <div class="bracket-match" id="bracket-quartas">...</div>
        </div>
        <div class="bracket-round">
          <h4>Semi/Final</h4>
          <div class="bracket-match" id="bracket-final">...</div>
        </div>
      </div>
    `;
  }
  
  if (stageName.includes("Pré-Oitavas") || stageName.includes("Repescagem")) {
    const el = document.getElementById("bracket-pre-oitavas");
    if(el) {
      el.className = "bracket-match active";
      el.innerHTML = `<span><b>Real</b> vs ${opponentName}</span> <span><b>${currentMatchScore}</b></span>`;
    }
  } else if (stageName.includes("Oitavas")) {
    const el = document.getElementById("bracket-oitavas");
    if(el) {
      el.className = "bracket-match active";
      el.innerHTML = `<span><b>Real</b> vs ${opponentName}</span> <span><b>${currentMatchScore}</b></span>`;
    }
  } else if (stageName.includes("Quartas")) {
    const el = document.getElementById("bracket-quartas");
    if(el) {
      el.className = "bracket-match active";
      el.innerHTML = `<span><b>Real</b> vs ${opponentName}</span> <span><b>${currentMatchScore}</b></span>`;
    }
  } else if (stageName.includes("Semifinal") || stageName.includes("Final")) {
    const el = document.getElementById("bracket-final");
    if(el) {
      el.className = "bracket-match active";
      el.innerHTML = `<span><b>Real (${stageName.split(" ")[0]})</b> vs ${opponentName}</span> <span><b>${currentMatchScore}</b></span>`;
    }
  }
}

function spawnConfetti(container){
  const colors = ['#b8922f','#1f3c73','#4b2e6f'];
  for (let i=0;i<40;i++){
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random()*100+'%';
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.animationDuration = (1.2+Math.random()*1.2)+'s';
    c.style.animationDelay = (Math.random()*0.4)+'s';
    container.appendChild(c);
  }
}

function copyToClipboard() {
  const starsLine = " BERNABÉU ELEVEN ";
  const diffText = difficultySelect.value.toUpperCase();
  const modeText = draftModeSelect.value === 'almanac' ? "ALMANAQUE" : "CLÁSSICO";
  const statusCampanha = globalWins >= 5 ? (globalPerfect ? "CAMPEÃO INVICTO & IMPECÁVEL!" : "CAMPEÃO DA CHAMPIONS!") : "FIM DE JORNADA";
  const resumo = `Dificuldade: ${diffText} | Modo: ${modeText}\nVitórias: ${globalWins} | Gols: ${globalGf} - ${globalGa}`;
  
  let artilheiroTxt = "Sem gols";
  const sortedScorers = Object.entries(scorers).sort((a,b)=>b[1]-a[1]);
  if (sortedScorers.length > 0) {
    artilheiroTxt = `${sortedScorers[0][0]} (${sortedScorers[0][1]} gols)`;
  }

  let squadTxt = "";
  FORMATION.forEach((pos, i) => {
    if (xi[i]) {
      const isCap = captainIdx === i ? " (C)" : "";
      squadTxt += `\n[${pos}] ${xi[i].n}${isCap} (OVR: ${xi[i].ovr})`;
    }
  });

  const fullText = `${starsLine}\n\n Status: ${statusCampanha}\n ${resumo}\n Artilheiro: ${artilheiroTxt}\n\n MEU TIME (${activeTacticName}):${squadTxt}`;
  
  navigator.clipboard.writeText(fullText).then(() => {
    alert("Copiado!");
  }).catch(err => {
    console.error("Erro ao copiar: ", err);
  });
}

// ============================================================================
// SIMULADOR DE PARTIDA EM TEMPO REAL COM ESTADOS E FICHA TÉCNICA
// ============================================================================
function startLiveMatchSimulation(opp, isKnockout, homeMatch, onMatchFinished, tieInfo = null) {
  const strength = teamStrength();
  const takerOvr = xi[penaltyIdx].ovr;
  
  const randomStadium = homeMatch ? "Santiago Bernabéu" : (opp.arena || "Estádio Lendário da UEFA 🏟️");
  const randomWeather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];

  const legLabel = tieInfo ? (tieInfo.leg === 1 ? "Jogo de Ida" : "Jogo de Volta") : null;
  
  let { myGoals: regMyGoals, oppGoals: regOppGoals } = simulateMatch(strength, opp, homeMatch, 90);
  
  let localMatchScorersTracker = {};
  const regMyList = distributeGoals(regMyGoals, 1, 90, localMatchScorersTracker);
  const regOppList = distributeOpponentGoals(opp, regOppGoals, 1, 90);
  
  let chronologicalEvents = [];
  regMyList.forEach(s => {
    chronologicalEvents.push({ type: 'us', name: s.name, assister: s.assister, minute: s.minute, isPen: s.isPenalty, isFk: s.isFreekick, isHd: s.isHeader, isLs: s.isLongShot });
  });
  regOppList.forEach(s => {
    chronologicalEvents.push({ type: 'them', name: s.name, assister: s.assister, minute: s.minute, isPen: s.isPenalty });
  });

  const willDecideOnAggregate = !!(tieInfo && tieInfo.leg === 2);
  const aggMyAfterReg = willDecideOnAggregate ? tieInfo.aggMy + regMyGoals : regMyGoals;
  const aggOppAfterReg = willDecideOnAggregate ? tieInfo.aggOpp + regOppGoals : regOppGoals;

  let isExtraTimeTriggered = false;
  let extMyGoals = 0, extOppGoals = 0;

  if (isKnockout && aggMyAfterReg === aggOppAfterReg) {
    isExtraTimeTriggered = true;
    
    let extraSim = simulateMatch(strength, opp, false, 30);
    extMyGoals = extraSim.myGoals;
    extOppGoals = extraSim.oppGoals;

    const extMyList = distributeGoals(extMyGoals, 91, 120, localMatchScorersTracker);
    const extOppList = distributeOpponentGoals(opp, extOppGoals, 91, 120);

    extMyList.forEach(s => {
      chronologicalEvents.push({ type: 'us', name: s.name, assister: s.assister, minute: s.minute, isPen: s.isPenalty, isFk: s.isFreekick, isHd: s.isHeader, isLs: s.isLongShot });
    });
    extOppList.forEach(s => {
      chronologicalEvents.push({ type: 'them', name: s.name, assister: s.assister, minute: s.minute, isPen: s.isPenalty });
    });
  }

  chronologicalEvents.sort((a,b) => a.minute - b.minute);

  const currentStageName = stageTimeline[currentStageIndex].name + (legLabel ? ` · ${legLabel}` : '');
  const locationTag = homeMatch ? "CASA" : "FORA";
  const aggregateSoFarTag = (tieInfo && tieInfo.leg === 2) ? `<div class="match-conditions"> Placar de ida: ${tieInfo.aggMy} × ${tieInfo.aggOpp} (${opp.n})</div>` : '';

  const row = document.createElement('div');
  row.className = 'match';
  row.innerHTML = `
    <div class="match-conditions"> ${randomStadium} (${locationTag}) |  Clima: ${randomWeather}</div>
    ${aggregateSoFarTag}
    <div class="match-header">
      <div>
        <span class="stage">${currentStageName}</span>
        <span class="teams"><span class="us">Real Madrid</span> vs ${opp.n}</span>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <span class="time-live" id="live-clock">1'</span>
        <span class="score" id="live-score">0 × 0</span>
      </div>
      <span class="badge draw" id="live-badge">Simulando</span>
    </div>
    <div class="match-events" id="live-events" style="display:none;"></div>
    <div class="match-stats-panel hidden" id="live-stats"></div>
  `;
  matchesBox.insertBefore(row, matchesBox.firstChild); 
  row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  const liveClock = row.querySelector('#live-clock');
  const liveScore = row.querySelector('#live-score');
  const liveEvents = row.querySelector('#live-events');
  const liveBadge = row.querySelector('#live-badge');
  const liveStats = row.querySelector('#live-stats');

  let currentMinute = 1;
  let runningUsGoals = 0;
  let runningThemGoals = 0;
  let shownEventsCount = 0;
  
  const endMinute = isExtraTimeTriggered ? 120 : 90;
  const selectedSpeed = parseInt(speedSelect.value) || 60;

  let shownProrrogacaoBanner = false;

  const clockInterval = setInterval(() => {
    currentMinute++;
    liveClock.textContent = currentMinute + "'";

    if (currentMinute === 91 && !shownProrrogacaoBanner) {
      shownProrrogacaoBanner = true;
      const banner = document.createElement('div');
      banner.style.color = 'var(--gold-bright)';
      banner.style.fontWeight = 'bold';
      banner.style.borderTop = '1px dashed var(--gold)';
      banner.style.borderBottom = '1px dashed var(--gold)';
      banner.style.padding = '4px 0';
      banner.style.margin = '5px 0';
      banner.style.textAlign = 'center';
      banner.textContent = '⏱️ PRORROGAÇÃO (30 MIN ADICIONAIS)!';
      liveEvents.appendChild(banner);
    }

    while (shownEventsCount < chronologicalEvents.length && chronologicalEvents[shownEventsCount].minute <= currentMinute) {
      const evt = chronologicalEvents[shownEventsCount];
      
      if (liveEvents.style.display === "none") {
        liveEvents.style.display = "block";
      }

      const div = document.createElement('div');
      const penText = evt.isPen ? " (P)" : (evt.isFk ? " (Falta)" : (evt.isHd ? " (Cabeça)" : (evt.isLs ? " (Fora da Área)" : "")));
      const assistText = evt.assister ? ` <span style="color:var(--muted); font-size:9.5px;">(Assist: ${evt.assister})</span>` : "";

      if (evt.type === 'us') {
        runningUsGoals++;
        div.innerHTML = `⚽ <b>Real Madrid:</b> ${evt.name}${penText} (${evt.minute}') ${assistText}`;
      } else {
        runningThemGoals++;
        div.innerHTML = `<span style="color:var(--muted)">⚽ <b>${opp.n}:</b> ${evt.name}${penText} (${evt.minute}') ${assistText}</span>`;
      }
      liveEvents.appendChild(div);
      
      liveScore.textContent = `${runningUsGoals} × ${runningThemGoals}`;
      shownEventsCount++;
    }

    if (currentMinute >= endMinute) {
      clearInterval(clockInterval);
      liveClock.style.display = "none";

      const decisionMy = willDecideOnAggregate ? tieInfo.aggMy + runningUsGoals : runningUsGoals;
      const decisionOpp = willDecideOnAggregate ? tieInfo.aggOpp + runningThemGoals : runningThemGoals;
      const wentToPSO = isKnockout && decisionMy === decisionOpp;

      let psoInfo = null;
      let effectiveWin = decisionMy > decisionOpp;

      if (wentToPSO) {
        psoInfo = simulateShootout(strength, opp.s, takerOvr);
        effectiveWin = psoInfo.win;
        
        if (effectiveWin) {
          scorers[xi[penaltyIdx].n] = (scorers[xi[penaltyIdx].n] || 0) + 1;
        }

        const mk = psoInfo.myKicks.map(h=>h?'⚽':'❌').join(' ');
        const ok = psoInfo.oppKicks.map(h=>h?'⚽':'❌').join(' ');
        
        const psoRow = document.createElement('div');
        psoRow.className = "pso-row";
        psoRow.style.borderTop = "1px dashed var(--line)";
        psoRow.style.marginTop = "8px";
        psoRow.style.paddingTop = "8px";
        psoRow.innerHTML = `
          <span class="pso-kicks">Pênaltis (Nós): ${mk}</span>
          <span class="pso-kicks">(Eles): ${ok}</span>
          <span><b>(${psoInfo.myScore}–${psoInfo.oppScore})</b></span>
        `;
        liveEvents.appendChild(psoRow);
      }

      const isDrawThisLeg = runningUsGoals === runningThemGoals;
      const matchOutcomeClass = effectiveWin ? 'win' : (isDrawThisLeg && !isKnockout ? 'draw' : 'loss');
      let badgeText = effectiveWin ? 'Vitória' : (isDrawThisLeg && !isKnockout ? 'Empate' : 'Derrota');
      if (tieInfo && tieInfo.leg === 2) {
        badgeText = effectiveWin ? 'Classificado' : 'Eliminado';
      }

      row.className = 'match ' + matchOutcomeClass;
      liveBadge.className = 'badge ' + matchOutcomeClass;
      liveBadge.textContent = badgeText;

      let posseUs = Math.round(50 + (strength - opp.s) * 1.5 + (homeMatch ? 4 : -4) + (Math.random() * 8 - 4));
      posseUs = Math.min(68, Math.max(32, posseUs));
      const posseThem = 100 - posseUs;

      const chutesUs = Math.round(poisson(posseUs / 4)) + runningUsGoals;
      const chutesThem = Math.round(poisson(posseThem / 4)) + runningThemGoals;
      const chutesNoAlvoUs = Math.min(chutesUs, Math.max(runningUsGoals, Math.round(chutesUs * 0.45 + Math.random() * 2)));

      // Chance de o adversário não acertar NENHUM chute no nosso gol (só quando levamos 0 gols)
      const opponentHadZeroShotsOnTarget = runningThemGoals === 0 && Math.random() < 0.18;
      const chutesNoAlvoThem = opponentHadZeroShotsOnTarget ? 0 : Math.min(chutesThem, Math.max(runningThemGoals, Math.round(chutesThem * 0.42 + Math.random() * 2)));

      const faltasUs = Math.round(7 + Math.random() * 8);
      const faltasThem = Math.round(7 + Math.random() * 8);
      
      const amarelosUs = Math.round(Math.random() * 3);
      const amarelosThem = Math.round(Math.random() * 3);
      const vermelhoUs = Math.random() < 0.1;
      const vermelhoThem = Math.random() < 0.08;
      const redCardMinute = vermelhoUs ? (Math.floor(Math.random() * endMinute) + 1) : null;

      const availableForCards = xi.filter(p => p);
      const shuffledForCards = [...availableForCards].sort(() => Math.random() - 0.5);
      const yellowCardedNames = shuffledForCards.slice(0, Math.min(amarelosUs, shuffledForCards.length)).map(p => p.n);
      let redCardedName = null;
      if (vermelhoUs && availableForCards.length > 0) {
        redCardedName = availableForCards[Math.floor(Math.random() * availableForCards.length)].n;
      }

      // --- CÁLCULOS EXTRAS PARA AS MISSÕES ---
      const perfectShooting = chutesNoAlvoUs >= 5 && chutesNoAlvoUs === runningUsGoals;
      const hadFuzilariaThisMatch = chutesNoAlvoUs >= 15;
      const muralhaAereaThisMatch = opponentHadZeroShotsOnTarget;

      // "Chute no Estômago": abrir 3x0 antes dos 25 minutos
      let rushedThreeNilThisMatch = false;
      // "Mordida Inicial": marcamos no 1º tempo?
      let scoredFirstHalfThisMatch = false;
      // "Salvador da Pátria": gol nos acréscimos (min >= 88) que empata ou vira o jogo
      let stoppageTimeSaviorThisMatch = false;
      // "Fúria Desenfreada": hat-trick do mesmo jogador em até 15 minutos
      let rapidHatTrickThisMatch = false;
      // "Abafa o Caso": gol nos primeiros 5 minutos
      let earlyGoalThisMatch = false;
      // "Virada Épica": maior desvantagem enfrentada nesta partida/eliminatória
      let maxDeficitFaced = 0;

      {
        let ru = willDecideOnAggregate ? tieInfo.aggMy : 0;
        let rt = willDecideOnAggregate ? tieInfo.aggOpp : 0;
        const goalTimesByPlayer = {};

        chronologicalEvents.forEach(evt => {
          const prevRu = ru, prevRt = rt;
          if (evt.type === 'us') {
            ru++;
            if (evt.minute <= 25 && ru >= 3 && rt === 0) rushedThreeNilThisMatch = true;
            if (evt.minute <= 45) scoredFirstHalfThisMatch = true;
            if (evt.minute <= 5) earlyGoalThisMatch = true;
            if (evt.minute >= 88 && evt.minute <= 90 && prevRu <= prevRt && ru >= rt) stoppageTimeSaviorThisMatch = true;
            if (!goalTimesByPlayer[evt.name]) goalTimesByPlayer[evt.name] = [];
            goalTimesByPlayer[evt.name].push(evt.minute);
          } else {
            rt++;
          }
          maxDeficitFaced = Math.max(maxDeficitFaced, rt - ru);
        });

        Object.values(goalTimesByPlayer).forEach(minutes => {
          if (minutes.length < 3) return;
          minutes.sort((a,b) => a-b);
          for (let i = 0; i + 2 < minutes.length; i++) {
            if (minutes[i+2] - minutes[i] <= 15) rapidHatTrickThisMatch = true;
          }
        });
      }

      // "Mestre Tático" / "Foco na Missão": simula se houve um ajuste tático no intervalo
      const madeHalftimeTacticalChange = Math.random() < 0.5;


      const matchAssistsTracker = {};
      chronologicalEvents.forEach(evt => {
        if (evt.type === 'us' && evt.assister) {
          matchAssistsTracker[evt.assister] = (matchAssistsTracker[evt.assister] || 0) + 1;
        }
      });

      const goalImpactByPlayer = {};
      const freekickGoalsByPlayer = {};
      let runUsTrack = 0, runThemTrack = 0;
      chronologicalEvents.forEach(evt => {
        if (evt.type === 'us') {
          const marginBefore = Math.abs(runUsTrack - runThemTrack);
          const decisivenessFactor = 1 / (1 + Math.max(0, marginBefore - 1) * 0.28);
          const minuteFactor = 1.6 - ((evt.minute - 1) / 119) * 1.0;
          const goalPoints = 4 * decisivenessFactor * minuteFactor;
          goalImpactByPlayer[evt.name] = (goalImpactByPlayer[evt.name] || 0) + goalPoints;
          if (evt.isFk) freekickGoalsByPlayer[evt.name] = (freekickGoalsByPlayer[evt.name] || 0) + 1;
          runUsTrack++;
        } else {
          runThemTrack++;
        }
      });

      // --- CÁLCULO DO MVP: AVALIA TANTO O REAL QUANTO OS ADVERSÁRIOS ---
      let motmName = null, motmScore = -Infinity, isRealMadridPlayer = false;

      // 1. Avalia os jogadores do Real Madrid
      xi.forEach((pl, idx) => {
        if (!pl) return;
        const pos = FORMATION[idx];
        const goalPoints = goalImpactByPlayer[pl.n] || 0;
        const freekickBonus = (freekickGoalsByPlayer[pl.n] || 0) * 2;
        const assistsInMatch = matchAssistsTracker[pl.n] || 0;
        const cleanSheetBonus = (pos === 'GOL' && runningThemGoals === 0) ? 3 : 0;
        const decisivePenaltyBonus = (psoInfo && effectiveWin && penaltyIdx !== null && xi[penaltyIdx] && pl.n === xi[penaltyIdx].n) ? 4 : 0;
        const yellowPenalty = yellowCardedNames.includes(pl.n) ? 1 : 0;
        const redPenalty = redCardedName === pl.n ? 6 : 0;

        let score = goalPoints + freekickBonus + assistsInMatch * 2 + cleanSheetBonus + decisivePenaltyBonus
                    - yellowPenalty - redPenalty + (pl.ovr / 100) + Math.random() * 1.5;

        if (score > motmScore) {
          motmScore = score;
          motmName = pl.n;
          isRealMadridPlayer = true;
        }
      });

      // 2. Avalia os jogadores e o goleiro do time adversário
      const oppSquad = opp.squad || ["Jogador Oponente", "Atacante Rival"];
      oppSquad.forEach((oppPlayerName) => {
        let oppGoalsCount = 0;
        chronologicalEvents.forEach(evt => {
          if (evt.type === 'them' && evt.name === oppPlayerName) oppGoalsCount++;
        });

        const isOpponentGoalkeeper = oppPlayerName.toLowerCase().includes('goleiro') || oppPlayerName === (opp.squad ? opp.squad[opp.squad.length - 1] : '');
        let gkCleanSheetBonus = (runningUsGoals === 0 && (isOpponentGoalkeeper || Math.random() < 0.2)) ? 5 : 0;
        
        let oppScore = (oppGoalsCount * 4) + gkCleanSheetBonus + (opp.s / 100) + Math.random() * 2.0;

        if (oppScore > motmScore) {
          motmScore = oppScore;
          motmName = oppPlayerName;
          isRealMadridPlayer = false;
        }
      });

      if (motmName) {
        motmCounts[motmName] = (motmCounts[motmName] || 0) + 1;
      }
      const motmTotal = motmName ? motmCounts[motmName] : 0;

      // FORMATAÇÃO DO TEXTO DO MVP: Exibe a posição entre parênteses para QUALQUER jogador (nosso ou rival)
      let motmDisplayString = motmName;
      let posLabelText = "Atacante";

      if (isRealMadridPlayer) {
        const foundIdx = xi.findIndex(p => p && p.n === motmName);
        const playerPosKey = foundIdx !== -1 ? FORMATION[foundIdx] : null;
        posLabelText = playerPosKey ? (POS_LABEL[playerPosKey] || playerPosKey) : 'Jogador';
      } else {
        const lowerName = (motmName || '').toLowerCase();
        if (lowerName.includes('goleiro') || lowerName.includes('becker') || lowerName.includes('oblak') || lowerName.includes('donnarumma') || lowerName.includes('raya') || lowerName.includes('ter stegen') || lowerName.includes('neuer') || lowerName.includes('sommer') || lowerName.includes('martínez') || lowerName.includes('simon') || lowerName.includes('kepa') || lowerName.includes('ederson') || lowerName.includes('maignan') || lowerName.includes('sommer') || lowerName.includes('gazzaniga') || lowerName.includes('hradecky') || lowerName.includes('nübel') || lowerName.includes('gulácsi') || lowerName.includes('kobel') || lowerName.includes('carnesecchi') || lowerName.includes('digregorio') || lowerName.includes('skorupski') || lowerName.includes('bizot') || lowerName.includes('chevalier') || lowerName.includes('benítez') || lowerName.includes('wellenreuther') || lowerName.includes('israel') || lowerName.includes('trubin') || lowerName.includes('mignolet') || lowerName.includes('scherpen') || lowerName.includes('blaswich') || lowerName.includes('glazer') || lowerName.includes('riznyk') || lowerName.includes('nevistić') || lowerName.includes('takáč') || lowerName.includes('von ballmoos') || lowerName.includes('jensen')) {
          posLabelText = 'Goleiro';
        } else if (lowerName.includes('dias') || lowerName.includes('saliba') || lowerName.includes('van dijk') || lowerName.includes('rudiger') || lowerName.includes('marquinhos') || lowerName.includes('bastoni') || lowerName.includes('giménez') || lowerName.includes('konaté') || lowerName.includes('gabriel') || lowerName.includes('akanji') || lowerName.includes('stones') || lowerName.includes('calafiori') || lowerName.includes('white') || lowerName.includes('gomez') || lowerName.includes('torres') || lowerName.includes('konsa') || lowerName.includes('koundé') || lowerName.includes('cubarsí') || lowerName.includes('martínez') || lowerName.includes('normand') || lowerName.includes('azpilicueta') || lowerName.includes('tapsoba') || lowerName.includes('hincapié') || lowerName.includes('rouault') || lowerName.includes('min-jae') || lowerName.includes('upamecano') || lowerName.includes('lukeba') || lowerName.includes('klostermann') || lowerName.includes('orbán') || lowerName.includes('schlotterbeck') || lowerName.includes('süle') || lowerName.includes('bensebaini') || lowerName.includes('pavard') || lowerName.includes('de vrij') || lowerName.includes('djimsiti') || lowerName.includes('tomori') || lowerName.includes('calabria') || lowerName.includes('gatti') || lowerName.includes('danilo') || lowerName.includes('lucumí') || lowerName.includes('pacho') || lowerName.includes('kehrer') || lowerName.includes('diakité') || lowerName.includes('boscagli') || lowerName.includes('hancko') || lowerName.includes('inácio') || lowerName.includes('diomande') || lowerName.includes('otamendi') || lowerName.includes('carter-vickers') || lowerName.includes('wüthrich') || lowerName.includes('spajić') || lowerName.includes('matviyenko') || lowerName.includes('ristovski') || lowerName.includes('vitík') || lowerName.includes('zappacosta')) {
          posLabelText = 'Zagueiro';
        } else if (lowerName.includes('walker') || lowerName.includes('gvardiol') || lowerName.includes('robertson') || lowerName.includes('digne') || lowerName.includes('cash') || lowerName.includes('balde') || lowerName.includes('gutiérrez') || lowerName.includes('arnau') || lowerName.includes('lino') || lowerName.includes('grimaldo') || lowerName.includes('frimpong') || lowerName.includes('vagnoman') || lowerName.includes('davies') || lowerName.includes('henrichs') || lowerName.includes('geertruida') || lowerName.includes('dumfries') || lowerName.includes('kolašinac') || lowerName.includes('hernández') || lowerName.includes('cambiaso') || lowerName.includes('posch') || lowerName.includes('mendes') || lowerName.includes('hakimi') || lowerName.includes('vanderson') || lowerName.includes('lala') || lowerName.includes('gudmundsson') || lowerName.includes('dedić') || lowerName.includes('bah')) {
          posLabelText = 'Lateral';
        } else if (lowerName.includes('rodri') || lowerName.includes('rice') || lowerName.includes('kimmich') || lowerName.includes('mac allister') || lowerName.includes('valverde') || lowerName.includes('pedri') || lowerName.includes('bellingham') || lowerName.includes('de bruyne') || lowerName.includes('kovacic') || lowerName.includes('partey') || lowerName.includes('merino') || lowerName.includes('jones') || lowerName.includes('gravenberch') || lowerName.includes('onana') || lowerName.includes('ramsey') || lowerName.includes('de jong') || lowerName.includes('gavi') || lowerName.includes('herrera') || lowerName.includes('de paul') || lowerName.includes('llorente') || lowerName.includes('gallagher') || lowerName.includes('witsel') || lowerName.includes('xhaka') || lowerName.includes('palacios') || lowerName.includes('stiller') || lowerName.includes('goretzka') || lowerName.includes('laimer') || lowerName.includes('haidara') || lowerName.includes('vermeeren') || lowerName.includes('can') || lowerName.includes('groß') || lowerName.includes('barella') || lowerName.includes('calhanoglu') || lowerName.includes('frattesi') || lowerName.includes('mkhitaryan') || lowerName.includes('éderson') || lowerName.includes('de roon') || lowerName.includes('reijnders') || lowerName.includes('loftus-cheek') || lowerName.includes('bennacer') || lowerName.includes('fofana') || lowerName.includes('luiz') || lowerName.includes('locatelli') || lowerName.includes('thuram') || lowerName.includes('freuler') || lowerName.includes('fabbian') || lowerName.includes('vitinha') || lowerName.includes('zaïre-emery') || lowerName.includes('zakaria') || lowerName.includes('camara') || lowerName.includes('lees-melou') || lowerName.includes('andré') || lowerName.includes('gomes') || lowerName.includes('veerman') || lowerName.includes('schouten') || lowerName.includes('timber') || lowerName.includes('hjulmand') || lowerName.includes('köckçü') || lowerName.includes('aursnes') || lowerName.includes('sanches') || lowerName.includes('vanaken') || lowerName.includes('vetlesen') || lowerName.includes('mcgregor') || lowerName.includes('hatate') || lowerName.includes('kiteishvili') || lowerName.includes('bidstrup') || lowerName.includes('ivanić') || lowerName.includes('sudakov') || lowerName.includes('baturina') || lowerName.includes('kucka') || lowerName.includes('lauper') || lowerName.includes('ugrinic')) {
          posLabelText = 'Meio-Campista';
        } else {
          posLabelText = 'Atacante';
        }
      }

      motmDisplayString = `${motmName} (${posLabelText})`;

      // Renderização das estatísticas do confronto (com classe .away condicional para o cinza)
      liveStats.className = "match-stats-panel";
      liveStats.innerHTML = `
        <h5> Ficha Técnica da Partida</h5>
        ${motmName ? `<div class="motm-banner ${isRealMadridPlayer ? '' : 'away'}"><b>${motmDisplayString}</b><span class="motm-badge">MVP${motmTotal > 1 ? ` ×${motmTotal}` : ''}</span></div>` : ''}
        <div class="stats-row"><span>Real Madrid</span><span>Posse de Bola</span><span>${opp.n}</span></div>
        <div class="stats-bar-container">
          <div class="stats-bar-us" style="width: ${posseUs}%;"></div>
          <div class="stats-bar-them" style="width: ${posseThem}%;"></div>
        </div>
        <div class="stats-row"><span>${chutesUs} (${chutesNoAlvoUs})</span><span>Chutes (No Alvo)</span><span>${chutesThem} (${chutesNoAlvoThem})</span></div>
        <div class="stats-row"><span>${faltasUs}</span><span>Faltas Cometidas</span><span>${faltasThem}</span></div>
        <div class="stats-row"><span>🟨 ${amarelosUs}</span><span>Cartões Amarelos</span><span>🟨 ${amarelosThem}</span></div>
       ${(vermelhoUs || vermelhoThem) ? `<div class="stats-row"><span>${vermelhoUs ? '🟥 1' : '—'}</span><span>Cartões Vermelhos</span><span>${vermelhoThem ? '🟥 1' : '—'}</span></div>` : ''}
      `;

      onMatchFinished({
        effectiveWin,
        myGoals: runningUsGoals,
        oppGoals: runningThemGoals,
        psoInfo,
        wentToPenalties: wentToPSO,
        wentToExtraTime: isExtraTimeTriggered,
        yellowCards: amarelosUs,
        redCard: vermelhoUs,
        redCardMinute,
        weather: randomWeather,
        motmName,
        isRealMadridPlayer,
        scorerCounts: { ...localMatchScorersTracker },
        ourShotsOnTarget: chutesNoAlvoUs,
        oppShotsOnTarget: chutesNoAlvoThem,
        perfectShooting,
        hadFuzilariaThisMatch,
        muralhaAereaThisMatch,
        rushedThreeNilThisMatch,
        scoredFirstHalfThisMatch,
        stoppageTimeSaviorThisMatch,
        rapidHatTrickThisMatch,
        earlyGoalThisMatch,
        maxDeficitFaced,
        madeHalftimeTacticalChange
      });
    }
  }, selectedSpeed);
}

simBtn.onclick = () => {
  if (!(filledCount()===11 && captainIdx!==null && penaltyIdx!==null && freekickIdx!==null)) return;
  if (isEliminated) return;

  renderXI();

  simPanel.classList.remove('hidden');
  matchesBox.innerHTML = '';
  resultBox.classList.add('hidden');
  resultBox.classList.remove('perfect');
  groupStageContainer.innerHTML = '';
  bracketContainer.innerHTML = '';

  campaignOpponents = selectCampaignOpponents();
  
  initGroupStandings(campaignOpponents);

  globalWins = 0;
  globalGf = 0;
  globalGa = 0;
  globalPerfect = true;
  totalCleanSheets = 0;
  goleadasCount = 0;
  finalCleanSheet = false;
  totalYellowCards = 0;
  wonMatchWithRedCard = false;
  awayWins = 0;
  homePerfect = true;
  toughWeatherWin = false;
  cleanSheetSemi = false;
  wonViaPenalties = false;
  allMatchesScored = true;
  groupPoints = 0;
  currentStageIndex = 0; 
  isEliminated = false;
  maxGoalsSingleGame = 0;
  maxGoalsSingleGamePlayer = {};
  motmCounts = {};
  pendingTie = null;
  resetExtraQuestTrackers();
  hadToPlayPenaltiesInKnockout = false;

  simBtn.disabled = true;

  executeSingleStage();
};

let hadToPlayPenaltiesInKnockout = false;

function executeSingleStage() {
  matchControlRow.classList.add('hidden');

  if (isEliminated) {
    statsCampaign = { wins: globalWins, gf: globalGf, ga: globalGa, perfect: false };
    showResult(globalWins, globalGf, globalGa, false);
    return;
  }

  if (currentStageIndex > 10) { 
    statsCampaign = { wins: globalWins, gf: globalGf, ga: globalGa, perfect: globalPerfect };
    showResult(globalWins, globalGf, globalGa, globalPerfect);
    return;
  }

  const currentStage = stageTimeline[currentStageIndex];
  const opp = campaignOpponents[currentStageIndex];

  let groupOpponentIndex = currentStageIndex;
  if (currentStageIndex >= 3 && currentStageIndex <= 5) {
    groupOpponentIndex = currentStageIndex - 3;
  }

  const isTwoLegged = currentStage.knockout && currentStage.twoLegged;
  const legNumber = isTwoLegged ? (pendingTie ? 2 : 1) : null;
  const isDecisiveLeg = !isTwoLegged || legNumber === 2;
  const tieInfo = (isTwoLegged && legNumber === 2) ? { leg: 2, aggMy: pendingTie.aggMy, aggOpp: pendingTie.aggOpp } : (isTwoLegged ? { leg: 1 } : null);

  let homeMatch;
  if (!currentStage.knockout) {
    homeMatch = currentStage.home;
  } else if (isTwoLegged) {
    homeMatch = legNumber === 2;
  } else {
    homeMatch = false;
  }

  startLiveMatchSimulation(opp, currentStage.knockout && isDecisiveLeg, homeMatch, (result) => {
    
    globalGf += result.myGoals; 
    globalGa += result.oppGoals;

    if (result.oppGoals === 0 && currentStageIndex <= 5) {
      totalCleanSheets++;
    }

    if (result.myGoals - result.oppGoals >= 3) {
      goleadasCount++;
    }

    if (currentStageIndex === 10 && result.oppGoals === 0) {
      finalCleanSheet = true;
    }

    if (currentStageIndex === 9 && result.oppGoals === 0) {
      cleanSheetSemi = true;
    }

    totalYellowCards += (result.yellowCards || 0);

    if (result.redCard && result.effectiveWin) {
      wonMatchWithRedCard = true;
    }

    if (result.myGoals === 0) {
      allMatchesScored = false;
    }

    if (result.weather && (result.weather.includes("Chuva") || result.weather.includes("Neve")) && result.effectiveWin) {
      toughWeatherWin = true;
    }

    if (result.wentToPenalties && result.effectiveWin) {
      wonViaPenalties = true;
    }

    if (homeMatch) {
      if (!result.effectiveWin) homePerfect = false;
    } else {
      if (result.effectiveWin) awayWins++;
    }

    if (result.wentToPenalties) {
      hadToPlayPenaltiesInKnockout = true;
    }

    // --- ATUALIZAÇÃO DOS NOVOS CONTROLES DE MISSÕES (roda em toda partida/perna jogada) ---
    const scorerCounts = result.scorerCounts || {};
    const scorersThisMatch = new Set(Object.keys(scorerCounts));

    xi.forEach(pl => {
      if (!pl) return;
      if (scorersThisMatch.has(pl.n)) {
        scoringStreaks[pl.n] = (scoringStreaks[pl.n] || 0) + 1;
        maxScoringStreak = Math.max(maxScoringStreak, scoringStreaks[pl.n]);
      } else {
        scoringStreaks[pl.n] = 0;
      }
    });

    if (currentStageIndex <= 5) {
      groupStageGoalsTotal += result.myGoals;
      if (!result.scoredFirstHalfThisMatch) groupFirstHalfAllScored = false;
      if (!result.effectiveWin) groupStagePerfectWins = false;
      if (currentStageIndex === 0 && result.effectiveWin && (result.myGoals - result.oppGoals) >= 3) {
        wonFirstMatchBig = true;
      }
    }

    if (result.rushedThreeNilThisMatch) hadRushedThreeNil = true;
    if (result.perfectShooting) hadPerfectShooting = true;
    if (result.hadFuzilariaThisMatch) hadFuzilaria = true;
    if (result.muralhaAereaThisMatch && result.effectiveWin) hadMuralhaAerea = true;
    if (result.stoppageTimeSaviorThisMatch) hadStoppageTimeSavior = true;
    if (result.rapidHatTrickThisMatch) hadRapidHatTrick = true;
    if (result.earlyGoalThisMatch) hadEarlyGoal = true;
    if ((result.myGoals + result.oppGoals) >= 5) hadFiveGoalMatch = true;
    if (result.effectiveWin && (result.myGoals - result.oppGoals) >= 5) hadFiveGoalDiffWin = true;
    if (!homeMatch) awayGoalsTotal += result.myGoals;

    if (result.redCard && result.redCardMinute !== null && result.redCardMinute <= 45 && result.effectiveWin) {
      wonWithRedCardFirstHalf = true;
    }

    if ((result.yellowCards || 0) === 0 && !result.redCard) {
      currentNoCardStreak++;
      maxNoCardStreak = Math.max(maxNoCardStreak, currentNoCardStreak);
    } else {
      currentNoCardStreak = 0;
    }

    if (CLASSIC_RIVALS.includes(opp.n)) {
      classicMatchesPlayed++;
      if (result.effectiveWin) classicMatchesWon++;
    }

    if (currentStageIndex === 8 && isDecisiveLeg && result.effectiveWin && (opp.s > teamStrength() || TRADITIONAL_RIVALS.includes(opp.n))) {
      beatStrongRivalQuartas = true;
    }

    if (result.effectiveWin) {
      xi.forEach(pl => {
        if (pl && pl.ovr < 80 && (scorerCounts[pl.n] || 0) > 0) underdogDecisiveGoal = true;
      });
    }

    if (currentStage.knockout && result.effectiveWin && result.maxDeficitFaced >= 2) {
      hadEpicComeback = true;
    }

    if (result.effectiveWin) {
      if (result.madeHalftimeTacticalChange) {
        madeHalftimeChangeAndWon = true;
      } else if (currentStage.knockout) {
        wonKnockoutWithoutHalftimeChange = true;
      }
    }

    if (currentStageIndex >= 7 && currentStageIndex <= 10 && result.myGoals < result.oppGoals) {
      noLossInKnockoutFromOitavas = false;
    }

    if (currentStageIndex === 10) {
      playedFinalMatch = true;
      if (Object.values(scorerCounts).some(count => count >= 2)) dono_da_finalFlag = true;
      if (result.effectiveWin && (result.myGoals - result.oppGoals) >= 3) wonFinalBig = true;
    }

    if (!currentStage.knockout && result.myGoals > result.oppGoals) {
      globalWins++;
    }

    if (isTwoLegged && legNumber === 1) {
      pendingTie = { aggMy: result.myGoals, aggOpp: result.oppGoals };

      hudGF.textContent = globalGf;
      hudGA.textContent = globalGa;

      renderBracket(currentStage.name, opp.n, `Ida: ${result.myGoals} - ${result.oppGoals}`);

      nextMatchBtn.textContent = `Jogar Jogo da Volta: ${currentStage.name} ➔`;
      matchControlRow.classList.remove('hidden');
      return;
    }

    let scoreLabel = `${result.myGoals} - ${result.oppGoals}`;

    if (isTwoLegged) {
      const aggMy = pendingTie.aggMy + result.myGoals;
      const aggOpp = pendingTie.aggOpp + result.oppGoals;
      scoreLabel = `Ida ${pendingTie.aggMy}-${pendingTie.aggOpp} / Volta ${result.myGoals}-${result.oppGoals} (Agregado ${aggMy}-${aggOpp})`;
      if (result.wentToExtraTime) scoreLabel += ` · Prorrogação`;
      if (result.wentToPenalties) scoreLabel += ` · Pên. ${result.psoInfo.myScore}-${result.psoInfo.oppScore}`;
      pendingTie = null;
    } else if (result.wentToPenalties) {
      scoreLabel += ` (Pên. ${result.psoInfo.myScore}-${result.psoInfo.oppScore})`;
    }

    if (currentStage.knockout) {
      if (result.effectiveWin) {
        globalWins++;
      } else {
        isEliminated = true;
      }
    }

    if (result.oppGoals > 0 || !result.effectiveWin) globalPerfect = false;

    hudW.textContent = globalWins; 
    hudGF.textContent = globalGf; 
    hudGA.textContent = globalGa;

    if (currentStageIndex <= 5) {
      updateGroupTableLive(campaignOpponents, result.myGoals, result.oppGoals, groupOpponentIndex, currentStageIndex);
    } else {
      renderBracket(currentStage.name, opp.n, scoreLabel);
    }

    if (currentStageIndex === 5) {
      const myRank = groupTeamsStats.findIndex(t => t.isUser) + 1;

      if (myRank <= 2) {
        currentStageIndex = 7; 
      } else if (myRank === 3) {
        currentStageIndex = 6; 
      } else {
        isEliminated = true;
      }
    } else {
      currentStageIndex++;
    }

    if (isEliminated) {
      nextMatchBtn.textContent = "Ver Resultado da Eliminação ";
    } else if (currentStageIndex > 10) {
      nextMatchBtn.textContent = "Erguer a Taça! (Ver Resultado Final) ";
    } else {
      const nextStageName = stageTimeline[currentStageIndex].name;
      nextMatchBtn.textContent = `Jogar próxima partida: ${nextStageName} ➔`;
    }

    matchControlRow.classList.remove('hidden');
  }, tieInfo);
}

nextMatchBtn.onclick = executeSingleStage;

function evaluateQuests(championName) {
  const sortedScorers = Object.entries(scorers).sort((a,b) => b[1] - a[1]);
  const sortedAssisters = Object.entries(assisters).sort((a,b) => b[1] - a[1]);

  activeQuests.forEach(q => {
    let completed = false;

    if (q.id === "garcom") {
      completed = sortedAssisters.some(([name, assists]) => assists >= 5);
    } 
    else if (q.id === "dono") {
      if (captainIdx !== null && xi[captainIdx] && sortedScorers.length > 0) {
        const captainName = xi[captainIdx].n;
        const topScorerName = sortedScorers[0][0];
        const topScorerGoals = sortedScorers[0][1];
        const secondScorerGoals = sortedScorers[1] ? sortedScorers[1][1] : 0;
        if (captainName === topScorerName && topScorerGoals > secondScorerGoals) {
          completed = true;
        }
      }
    } 
    else if (q.id === "hat") {
      completed = maxGoalsSingleGame >= 3;
    } 
    else if (q.id === "raio") {
      const isViniTitular = xi.some(pl => pl && pl.n === "Vinícius Júnior");
      const viniGoals = scorers["Vinícius Júnior"] || 0;
      completed = isViniTitular && viniGoals >= 3;
    } 
    else if (q.id === "robo") {
      const isCr7Titular = xi.some(pl => pl && pl.n === "Cristiano Ronaldo");
      const cr7MaxGame = maxGoalsSingleGamePlayer["Cristiano Ronaldo"] || 0;
      completed = isCr7Titular && cr7MaxGame >= 3;
    }
    else if (q.id === "muralha") {
      completed = globalGa <= 4;
    } 
    else if (q.id === "galaticos") {
      const count90 = xi.filter(pl => pl && pl.ovr >= 90).length;
      completed = count90 >= 3;
    } 
    else if (q.id === "copero") {
      const uniqueScorers = Object.keys(scorers).filter(name => name !== "Real Madrid").length;
      completed = uniqueScorers >= 5;
    } 
    else if (q.id === "perfeito") {
      completed = (championName === "Real Madrid" && !hadToPlayPenaltiesInKnockout);
    }
    else if (q.id === "zaga_artilheira") {
      let defGoals = 0;
      FORMATION.forEach((pos, idx) => {
        if (xi[idx] && (pos === "ZAG" || pos === "LD" || pos === "LE")) {
          defGoals += (scorers[xi[idx].n] || 0);
        }
      });
      completed = defGoals >= 2;
    }
    else if (q.id === "meio_ouro") {
      let midfieldGoals = 0;
      FORMATION.forEach((pos, idx) => {
        if (xi[idx] && (pos === "MC" || pos === "MEI" || pos === "VOL")) {
          midfieldGoals += (scorers[xi[idx].n] || 0);
        }
      });
      completed = midfieldGoals >= 4;
    }
    else if (q.id === "sexto_homem") {
      completed = xi.some((pl, idx) => {
        if (pl && (FORMATION[idx] === "ZAG" || FORMATION[idx] === "LD" || FORMATION[idx] === "LE" || FORMATION[idx] === "VOL")) {
          return (assisters[pl.n] || 0) >= 3;
        }
        return false;
      });
    }
    else if (q.id === "clean_sheet") {
      completed = totalCleanSheets >= 3;
    }
    else if (q.id === "ataque_total") {
        const tiposAtacantes = ["PE", "PD", "CA", "SA"];
        const atacantesTitulares = xi.filter((pl, idx) => pl && tiposAtacantes.includes(FORMATION[idx]));
        completed = atacantesTitulares.length >= 3 && 
                    atacantesTitulares.every(pl => (scorers[pl.n] || 0) >= 1);
    }
    else if (q.id === "muro_zero") {
      completed = globalGa === 0;
    }
    else if (q.id === "camisa_9") {
      let camisa9Goals = 0;
      FORMATION.forEach((pos, idx) => {
        if (xi[idx] && pos === "CA") {
          camisa9Goals += (scorers[xi[idx].n] || 0);
        }
      });
      completed = camisa9Goals >= 6;
    }
    else if (q.id === "show_goleadas") {
      completed = goleadasCount >= 2;
    }
    else if (q.id === "capitao_provedor") {
      completed = captainIdx !== null && xi[captainIdx] && (assisters[xi[captainIdx].n] || 0) >= 3;
    }
    else if (q.id === "lenda_absoluta") {
      completed = (championName === "Real Madrid" && difficultySelect.value === "champion");
    }
    else if (q.id === "final_blindada") {
      completed = finalCleanSheet && championName === "Real Madrid";
    }
    else if (q.id === "cartao_sujo") {
      completed = totalYellowCards >= 10;
    }
    else if (q.id === "fair_play") {
      completed = totalYellowCards <= 4;
    }
    else if (q.id === "dez_guerreiros") {
      completed = wonMatchWithRedCard;
    }
    else if (q.id === "capitao_de_ferro") {
      const posicoesDefensivas = ["ZAG", "LD", "LE", "VOL"];
      completed = championName === "Real Madrid" && captainIdx !== null &&
        posicoesDefensivas.includes(FORMATION[captainIdx]);
    }
    else if (q.id === "camisa10_magica") {
      let assistsMeio = 0;
      FORMATION.forEach((pos, idx) => {
        if (xi[idx] && (pos === "MC" || pos === "MEI")) {
          assistsMeio += (assisters[xi[idx].n] || 0);
        }
      });
      completed = assistsMeio >= 5;
    }
    else if (q.id === "heroi_penaltis") {
      completed = wonViaPenalties;
    }
    else if (q.id === "furia_visitante") {
      completed = awayWins >= 4;
    }
    else if (q.id === "fortaleza_bernabeu") {
      completed = homePerfect;
    }
    else if (q.id === "sob_tempestade") {
      completed = toughWeatherWin;
    }
    else if (q.id === "blindagem_final") {
      completed = cleanSheetSemi && finalCleanSheet && championName === "Real Madrid";
    }
    else if (q.id === "volante_surpresa") {
      let volGoals = 0;
      FORMATION.forEach((pos, idx) => {
        if (xi[idx] && pos === "VOL") {
          volGoals += (scorers[xi[idx].n] || 0);
        }
      });
      completed = volGoals >= 1;
    }
    else if (q.id === "show_do_meia") {
      let meiaGoals = 0;
      FORMATION.forEach((pos, idx) => {
        if (xi[idx] && pos === "MEI") {
          meiaGoals += (scorers[xi[idx].n] || 0);
        }
      });
      completed = meiaGoals >= 3;
    }
    else if (q.id === "campanha_relampago") {
      completed = championName === "Real Madrid" && speedSelect.value === "10";
    }
    else if (q.id === "investida_total") {
      completed = allMatchesScored && championName === "Real Madrid";
    }
    else if (q.id === "show_de_talentos") {
      completed = xi.length === 11 && xi.every(pl => pl && pl.ovr >= 85);
    }
    else if (q.id === "artilheiro_imparavel") {
      completed = maxScoringStreak >= 5;
    }
    else if (q.id === "paredao_defensivo") {
      const gk = xi.find((pl, idx) => pl && FORMATION[idx] === 'GOL');
      completed = !!gk && (motmCounts[gk.n] || 0) >= 3;
    }
    else if (q.id === "artilheiro_longe") {
      completed = longShotGoalsTotal >= 4;
    }
    else if (q.id === "artilheiro_primeiro_tempo") {
      completed = groupFirstHalfAllScored;
    }
    else if (q.id === "goleada_relampago_2") {
      completed = hadRushedThreeNil;
    }
    else if (q.id === "virada_epica") {
      completed = hadEpicComeback;
    }
    else if (q.id === "tiro_certo") {
      completed = hadPerfectShooting;
    }
    else if (q.id === "pedra_no_sapato") {
      completed = beatStrongRivalQuartas;
    }
    else if (q.id === "artilharia_pesada") {
      completed = groupStageGoalsTotal >= 20;
    }
    else if (q.id === "estreia_pe_direito") {
      completed = wonFirstMatchBig;
    }
    else if (q.id === "coracao_valente") {
      completed = wonWithRedCardFirstHalf;
    }
    else if (q.id === "cabecaco_certeiro") {
      completed = headerGoalsTotal >= 4;
    }
    else if (q.id === "canhao_longa_distancia") {
      completed = longShotGoalsTotal >= 3;
    }
    else if (q.id === "caiu_na_rede") {
      completed = headerGoalsTotal >= 3;
    }
    else if (q.id === "fuzilaria") {
      completed = hadFuzilaria;
    }
    else if (q.id === "trator_grupao") {
      completed = groupStagePerfectWins;
    }
    else if (q.id === "principezinho") {
      completed = xi.some(pl => pl && getPlayerAge(pl) !== null && getPlayerAge(pl) < 21);
    }
    else if (q.id === "experiencia_pura") {
      completed = playedFinalMatch && xi.some(pl => pl && getPlayerAge(pl) !== null && getPlayerAge(pl) >= 35);
    }
    else if (q.id === "festa_da_torcida") {
      completed = awayGoalsTotal >= 5;
    }
    else if (q.id === "dupla_infernal") {
      const tiposAtacantes = ["PE", "PD", "CA", "SA"];
      const bigScorers = xi.filter((pl, idx) => pl && tiposAtacantes.includes(FORMATION[idx]) && (scorers[pl.n] || 0) >= 5);
      completed = bigScorers.length >= 2;
    }
    else if (q.id === "goleada_historica") {
      completed = hadFiveGoalDiffWin;
    }
    else if (q.id === "jogo_liso") {
      completed = maxNoCardStreak >= 3;
    }
    else if (q.id === "carrasco_classicos") {
      completed = classicMatchesPlayed > 0 && classicMatchesPlayed === classicMatchesWon;
    }
    else if (q.id === "salvador_patria") {
      completed = hadStoppageTimeSavior;
    }
    else if (q.id === "hat_trick_relampago") {
      completed = hadRapidHatTrick;
    }
    else if (q.id === "muralha_aerea") {
      completed = hadMuralhaAerea;
    }
    else if (q.id === "ponta_agressivo") {
      const tiposPontas = ["PE", "PD"];
      completed = xi.some((pl, idx) => {
        if (!pl || !tiposPontas.includes(FORMATION[idx])) return false;
        const contributions = (scorers[pl.n] || 0) + (assisters[pl.n] || 0);
        return contributions >= 8;
      });
    }
    else if (q.id === "zagueiro_artilheiro_surpresa") {
      completed = zagHeaderCornerGoal;
    }
    else if (q.id === "pressao_alta") {
      completed = hadEarlyGoal;
    }
    else if (q.id === "bronze_ao_ouro") {
      completed = underdogDecisiveGoal;
    }
    else if (q.id === "foco_total") {
      completed = wonKnockoutWithoutHalftimeChange;
    }
    else if (q.id === "mestre_tatico") {
      completed = madeHalftimeChangeAndWon;
    }
    else if (q.id === "invicto_mata") {
      completed = championName === "Real Madrid" && noLossInKnockoutFromOitavas;
    }
    else if (q.id === "artilheiro_copas") {
      completed = dono_da_finalFlag;
    }
    else if (q.id === "ritmo_frenetico") {
      completed = hadFiveGoalMatch;
    }
    else if (q.id === "coroacao_perfeita") {
      completed = championName === "Real Madrid" && wonFinalBig;
    }

    updateQuestUI(q.id, completed);
  });
}

function updateQuestUI(id, completed) {
  const card = document.getElementById(`q-${id}`);
  const status = document.getElementById(`s-${id}`);
  if (!card || !status) return;
  if (completed) {
    card.classList.add('completed');
    status.className = 'quest-status done';
    status.textContent = 'COMPLETADA!';
  } else {
    card.classList.remove('completed');
    status.className = 'quest-status pending';
    status.textContent = 'Pendente';
  }
}

function getUefaChampion() {
  if (!isEliminated) return "Real Madrid";
  const pool = [...OPPONENTS].filter(opp => !campaignOpponents.slice(0, 3).some(g => g.n === opp.n));
  const finalWinner = pool[Math.floor(Math.random() * pool.length)];
  return finalWinner.n;
}

function showResult(wins, gf, ga, perfect){
  matchControlRow.classList.add('hidden');
  resultBox.classList.remove('hidden');
  const captainName = xi[captainIdx].n;
  
  const uefaChampion = getUefaChampion();
  
  evaluateQuests(uefaChampion);

  const sortedScorers = Object.entries(scorers).sort((a,b) => b[1] - a[1]);
  const sortedAssisters = Object.entries(assisters).sort((a,b) => b[1] - a[1]);
  
  // FILTRA APENAS OS MVPs DO REAL MADRID PARA O CRAQUE DA CAMPANHA
  const realMadridMotm = {};
  for (let name in motmCounts) {
    const isOurPlayer = xi.some(p => p && p.n === name);
    if (isOurPlayer) {
      realMadridMotm[name] = motmCounts[name];
    }
  }
  const sortedMotm = Object.entries(realMadridMotm).sort((a,b) => b[1] - a[1]);

  let statsHtml = '<div class="stats-grid">';
  
  statsHtml += `
    <div class="top-scorers">
      <h3> Artilheiros do Real Madrid</h3>
      <ul>
        ${sortedScorers.length > 0 ? sortedScorers.slice(0, 5).map(([name, goals], index) => {
          return `
            <li>
              <div class="scorer-name">
                <span class="rank-badge">${index + 1}</span>
                <span>${name}</span>
              </div>
              <div class="scorer-goals">${goals} G</div>
            </li>`;
        }).join('') : '<li style="color:var(--muted)">Nenhum gol marcado</li>'}
      </ul>
    </div>`;

  statsHtml += `
    <div class="top-scorers" style="border-color:#1f3c73;">
      <h3 style="color:#1f3c73; border-bottom-color:#1f3c73;">Garçons do Real Madrid</h3>
      <ul>
        ${sortedAssisters.length > 0 ? sortedAssisters.slice(0, 5).map(([name, assists], index) => {
          return `
            <li style="color:#16213a;">
              <div class="scorer-name">
                <span class="rank-badge">${index + 1}</span>
                <span>${name}</span>
              </div>
              <div class="scorer-goals" style="color:#ffffff; background:#1f3c73;">${assists} A</div>
            </li>`;
        }).join('') : '<li style="color:var(--muted)">Nenhuma assistência registrada</li>'}
      </ul>
    </div>`;

  // SE HOUVE PELO MENOS UM CRAQUE DO REAL, EXIBE. SE NÃO, MOSTRA NENHUM.
  if (sortedMotm.length > 0) {
    const [bestName, bestCount] = sortedMotm[0];
    const bestIdx = xi.findIndex(p => p && p.n === bestName);
    const bestPos = bestIdx !== -1 ? (POS_LABEL[FORMATION[bestIdx]] || FORMATION[bestIdx]) : '';
    
    statsHtml += `
      <div class="top-scorers" style="border-color:var(--gold); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
        <h3 style="color:var(--gold-bright); border-bottom-color:var(--gold);"> Craque da Campanha</h3>
        <div style="font-family:'Cinzel',serif; font-size:16px; color:var(--ink); margin:6px 0 2px;">${bestName}</div>
        <div style="font-size:11px; color:var(--muted); margin-bottom:10px;">${bestPos}</div>
        <div class="scorer-goals" style="color:#ffffff; background:var(--gold-bright); font-size:12px; padding:6px 14px;">MVP${bestCount > 1 ? ` ×${bestCount}` : ''}</div>
      </div>`;
  } else {
    statsHtml += `
      <div class="top-scorers" style="border-color:var(--line); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
        <h3 style="color:var(--muted); border-bottom-color:var(--line);"> Craque da Campanha</h3>
        <p style="color:var(--muted); font-size:11.5px; font-style:italic; margin-top:15px;">Nenhum jogador nosso foi eleito MVP</p>
      </div>`;
  }

  statsHtml += '</div>';

  const shareBtnHtml = `<div style="margin-top:14px;"><button class="primary" onclick="copyToClipboard()"> Compartilhar Campanha</button></div>`;

  if (isEliminated) {
    resultBox.innerHTML = `<h2> Fim de Linha! Eliminado!</h2>
      <p style="margin-bottom: 8px;">O Real Madrid caiu no torneio. Saldo final de ${gf} gols marcados e ${ga} sofridos.</p>
      <p style="font-size: 13px; color: var(--gold-bright); font-weight: bold; margin-bottom: 12px;"> Campeão da Champions: ${uefaChampion}</p>
      ${statsHtml}
      ${shareBtnHtml}`;
  } else if (perfect && wins >= 5){
    resultBox.classList.add('perfect');
    resultBox.innerHTML = `<h2> Campanha Perfeita — A Orelhuda é do Real de forma Invicta!</h2>
      <p style="margin-bottom: 8px;">O Real Madrid fez história sob a liderança do capitão ${captainName}. Nenhuma derrota, ${gf} gols prós e apenas ${ga} sofridos!</p>
      <p style="font-size: 13px; color: var(--gold-bright); font-weight: bold; margin-bottom: 12px;"> Campeão da Champions League: Real Madrid!</p>
      ${statsHtml}
      ${shareBtnHtml}`;
    spawnConfetti(resultBox);
  } else {
    resultBox.innerHTML = `<h2> Campeão da Champions League!</h2>
      <p style="margin-bottom: 8px;">O Real de Madrid ergue a Orelhuda novamente! Capitão ${captainName} levanta a taça após uma campanha épica de ${wins} vitórias.</p>
      <p style="font-size: 13px; color: var(--gold-bright); font-weight: bold; margin-bottom: 12px;"> Campeão da Champions League: Real Madrid!</p>
      ${statsHtml}
      ${shareBtnHtml}`;
    spawnConfetti(resultBox);
  }
  
  updateSimBtn();
  resultBox.scrollIntoView({ behavior: 'smooth', block: 'end' });
}