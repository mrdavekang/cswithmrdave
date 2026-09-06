(function(root){
  // Functional diagram: every view uses these same places and corridor connections.
  root.schoolMap = function(detail=false, alternative=false,focus=''){
    const points={entrance:[100,330],reception:[100,180],library:[360,180],junction:[560,180],c1:[560,70]};
    const current=points[focus];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 380" role="img" aria-label="Fictional school route map">
    <rect width="720" height="380" fill="white"/>
    <g fill="none" stroke="#d5d9df" stroke-width="28" stroke-linejoin="round"><path d="M100 330V180H560V70"/></g>
    <g fill="none" stroke="#253b55" stroke-width="2"><path d="M100 330V180H560V70"/></g>
    <path d="M100 180V60H450" fill="none" stroke="#ad3131" stroke-width="5" stroke-dasharray="8 6"/>
    <g font-family="Arial,sans-serif" font-size="24" fill="#171717">
      <text x="26" y="366">Main Entrance</text><text x="23" y="150">Reception</text>
      <text x="312" y="150">Library</text><text x="580" y="192">Junction</text>
      <text x="458" y="39">CS Room C1</text><text x="205" y="216">Main Corridor</text>
      <text x="180" y="84" font-size="20" fill="#a02323">STAFF ONLY — do not enter</text>
      <text x="535" y="96" font-size="20" text-anchor="end">Science</text><text x="535" y="121" font-size="20" text-anchor="end">Corridor</text>
      <text x="125" y="316" font-size="20">START: face Reception ↑</text>
    </g>
    <g fill="white" stroke="#171717" stroke-width="3"><circle cx="100" cy="330" r="9"/><circle cx="100" cy="180" r="9"/><circle cx="360" cy="180" r="9"/><circle cx="560" cy="180" r="7"/><circle cx="560" cy="70" r="9"/></g>
    ${current?`<circle cx="${current[0]}" cy="${current[1]}" r="17" fill="none" stroke="#a85b00" stroke-width="4"/>`:''}
    <g font-family="Arial,sans-serif" font-size="20" fill="#414141"><text x="24" y="116">Collect timetable</text><text x="311" y="116">Return book</text><text x="578" y="74">FINISH</text></g>
    ${detail?'<g fill="#fff1b7" stroke="#777"><rect x="223" y="112" width="30" height="40"/><rect x="434" y="246" width="45" height="28"/></g><g font-family="Arial,sans-serif" font-size="20" fill="#555"><text x="206" y="102">Poster</text><text x="424" y="294">Wall art</text></g>':''}
    ${alternative?'<path d="M100 180V280H650V70H560" fill="none" stroke="#166347" stroke-width="4" stroke-dasharray="8 5"/><g font-family="Arial,sans-serif" font-size="20" fill="#166347"><text x="272" y="273">Covered Courtyard</text><text x="578" y="308">East Door</text><text x="594" y="55">East Corner</text></g><path d="M424 170l20 20m0-20l-20 20" stroke="#b21c1c" stroke-width="5"/><text x="382" y="242" font-family="Arial,sans-serif" font-size="20" fill="#b21c1c">CLOSED here</text>':''}
    </svg>`;
  };
})(window);
