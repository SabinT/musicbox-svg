(this["webpackJsonpmusicbox-svg"]=this["webpackJsonpmusicbox-svg"]||[]).push([[0],{115:function(e,t,n){},116:function(e,t,n){"use strict";n.r(t);var a,r=n(0),i=n.n(r),s=n(10),o=n.n(s),l=(n(85),n(9)),c=n(7),m=n(11),u=n(12),h=n(13),d=(n(86),n(87),n(119));!function(e){e[e.Channel=1]="Channel",e[e.SysEx=2]="SysEx",e[e.Meta=3]="Meta"}(a||(a={}));var p,f=function e(t){Object(c.a)(this,e),this.deltaTime=void 0,this.absTimeSeconds=0,this.deltaTime=t};!function(e){e[e.None=0]="None",e[e.NoteOff=8]="NoteOff",e[e.NoteOn=9]="NoteOn",e[e.PolyphonicPressure=10]="PolyphonicPressure",e[e.Controller=11]="Controller",e[e.ProgramChange=12]="ProgramChange",e[e.ChannelPressure=13]="ChannelPressure",e[e.PitchBend=14]="PitchBend"}(p||(p={}));var g,v,E,b,N=function(e){Object(h.a)(n,e);var t=Object(u.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).channelMessageType=p.None,e.channel=0,e}return Object(m.a)(n,[{key:"getMidiEventType",value:function(){return a.Channel}}]),n}(f),y=function(e){Object(h.a)(n,e);var t=Object(u.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).note=0,e.velocity=0,e}return n}(N),S=function(e){Object(h.a)(n,e);var t=Object(u.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).controller=0,e.value=0,e}return n}(N),C=function(e){Object(h.a)(n,e);var t=Object(u.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).program=0,e}return n}(N),k=function(e){Object(h.a)(n,e);var t=Object(u.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).velocity=0,e}return n}(N),M=function(e){Object(h.a)(n,e);var t=Object(u.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).value=0,e}return n}(N),O=function(e){Object(h.a)(n,e);var t=Object(u.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).metaMessageType=0,e}return Object(m.a)(n,[{key:"getMidiEventType",value:function(){return a.Meta}}]),n}(f);!function(e){e[e.None=-1]="None",e[e.Cn1=0]="Cn1",e[e.Csn1=1]="Csn1",e[e.Dn1=2]="Dn1",e[e.Dsn1=3]="Dsn1",e[e.En1=4]="En1",e[e.Fn1=5]="Fn1",e[e.Fsn1=6]="Fsn1",e[e.Gn1=7]="Gn1",e[e.Gsn1=8]="Gsn1",e[e.An1=9]="An1",e[e.Asn1=10]="Asn1",e[e.Bn1=11]="Bn1",e[e.C0=12]="C0",e[e.Cs0=13]="Cs0",e[e.D0=14]="D0",e[e.Ds0=15]="Ds0",e[e.E0=16]="E0",e[e.F0=17]="F0",e[e.Fs0=18]="Fs0",e[e.G0=19]="G0",e[e.Gs0=20]="Gs0",e[e.A0=21]="A0",e[e.As0=22]="As0",e[e.B0=23]="B0",e[e.C1=24]="C1",e[e.Cs1=25]="Cs1",e[e.D1=26]="D1",e[e.Ds1=27]="Ds1",e[e.E1=28]="E1",e[e.F1=29]="F1",e[e.Fs1=30]="Fs1",e[e.G1=31]="G1",e[e.Gs1=32]="Gs1",e[e.A1=33]="A1",e[e.As1=34]="As1",e[e.B1=35]="B1",e[e.C2=36]="C2",e[e.Cs2=37]="Cs2",e[e.D2=38]="D2",e[e.Ds2=39]="Ds2",e[e.E2=40]="E2",e[e.F2=41]="F2",e[e.Fs2=42]="Fs2",e[e.G2=43]="G2",e[e.Gs2=44]="Gs2",e[e.A2=45]="A2",e[e.As2=46]="As2",e[e.B2=47]="B2",e[e.C3=48]="C3",e[e.Cs3=49]="Cs3",e[e.D3=50]="D3",e[e.Ds3=51]="Ds3",e[e.E3=52]="E3",e[e.F3=53]="F3",e[e.Fs3=54]="Fs3",e[e.G3=55]="G3",e[e.Gs3=56]="Gs3",e[e.A3=57]="A3",e[e.As3=58]="As3",e[e.B3=59]="B3",e[e.C4=60]="C4",e[e.Cs4=61]="Cs4",e[e.D4=62]="D4",e[e.Ds4=63]="Ds4",e[e.E4=64]="E4",e[e.F4=65]="F4",e[e.Fs4=66]="Fs4",e[e.G4=67]="G4",e[e.Gs4=68]="Gs4",e[e.A4=69]="A4",e[e.As4=70]="As4",e[e.B4=71]="B4",e[e.C5=72]="C5",e[e.Cs5=73]="Cs5",e[e.D5=74]="D5",e[e.Ds5=75]="Ds5",e[e.E5=76]="E5",e[e.F5=77]="F5",e[e.Fs5=78]="Fs5",e[e.G5=79]="G5",e[e.Gs5=80]="Gs5",e[e.A5=81]="A5",e[e.As5=82]="As5",e[e.B5=83]="B5",e[e.C6=84]="C6",e[e.Cs6=85]="Cs6",e[e.D6=86]="D6",e[e.Ds6=87]="Ds6",e[e.E6=88]="E6",e[e.F6=89]="F6",e[e.Fs6=90]="Fs6",e[e.G6=91]="G6",e[e.Gs6=92]="Gs6",e[e.A6=93]="A6",e[e.As6=94]="As6",e[e.B6=95]="B6",e[e.C7=96]="C7",e[e.Cs7=97]="Cs7",e[e.D7=98]="D7",e[e.Ds7=99]="Ds7",e[e.E7=100]="E7",e[e.F7=101]="F7",e[e.Fs7=102]="Fs7",e[e.G7=103]="G7",e[e.Gs7=104]="Gs7",e[e.A7=105]="A7",e[e.As7=106]="As7",e[e.B7=107]="B7",e[e.C8=108]="C8",e[e.Cs8=109]="Cs8",e[e.D8=110]="D8",e[e.Ds8=111]="Ds8",e[e.E8=112]="E8",e[e.F8=113]="F8",e[e.Fs8=114]="Fs8",e[e.G8=115]="G8",e[e.Gs8=116]="Gs8",e[e.A8=117]="A8",e[e.As8=118]="As8",e[e.B8=119]="B8",e[e.C9=120]="C9",e[e.Cs9=121]="Cs9",e[e.D9=122]="D9",e[e.Ds9=123]="Ds9",e[e.E9=124]="E9",e[e.F9=125]="F9",e[e.Fs9=126]="Fs9",e[e.G9=127]="G9"}(g||(g={})),function(e){e[e.SequenceNumber=0]="SequenceNumber",e[e.Text=1]="Text",e[e.CopyrightNotice=2]="CopyrightNotice",e[e.TrackName=3]="TrackName",e[e.InstrumentName=4]="InstrumentName",e[e.Lyrics=5]="Lyrics",e[e.Marker=6]="Marker",e[e.CuePoint=7]="CuePoint",e[e.ChannelPrefix=32]="ChannelPrefix",e[e.EndOfTrack=47]="EndOfTrack",e[e.SetTempo=81]="SetTempo",e[e.SmpteOffset=84]="SmpteOffset",e[e.TimeSignature=88]="TimeSignature",e[e.KeySignature=89]="KeySignature",e[e.SequencerSpecific=127]="SequencerSpecific"}(v||(v={})),function(e){e[e.singleTrack=0]="singleTrack",e[e.multiTrack=1]="multiTrack",e[e.Type2=2]="Type2"}(E||(E={})),function(e){e[e.metrical=0]="metrical",e[e.timecode=1]="timecode"}(b||(b={}));var F=function(){function e(t,n,a){Object(c.a)(this,e),this.fileFormat=E.multiTrack,this.numTracks=0,this.rawTimingData=0,this.timingScheme=b.metrical,this.pulsesPerQuarterNote=void 0,this.framesPerSecond=void 0,this.subFrameResolution=void 0,this.parseFromRawData(t,n,a)}return Object(m.a)(e,[{key:"parseFromRawData",value:function(e,t,n){var a=e.getUint16(t,!1),r=e.getUint16(t+2,!1),i=e.getUint16(t+4,!1),s=32768&i;this.fileFormat=a,this.rawTimingData=i,this.numTracks=r,this.timingScheme=s,s===b.metrical?this.pulsesPerQuarterNote=32767&i:(this.framesPerSecond=1+~(65280&i),this.subFrameResolution=255&i)}}]),e}(),w=function(){function e(t,n,a,r,i){Object(c.a)(this,e),this.events=[],this.header=void 0,this.header=t,this.parseFromRawData(n,a,r,i)}return Object(m.a)(e,[{key:"parseFromRawData",value:function(e,t,n,a){var r=t,i=!1,s=0,o=0,l=this.header.timingScheme===b.metrical;a&&a.secondsPerTickValues&&a.secondsPerTickValues.length>0?o=a.secondsPerTickValues[a.secondsPerTickValues.length-1]:l&&this.header.pulsesPerQuarterNote&&(o=60/(120*this.header.pulsesPerQuarterNote));for(var c=0;!i&&r<t+n;){for(var m=e.getUint8(r++),u=127&m;128&m;)u=(u<<7)+(127&(m=e.getUint8(r++)));l&&(s+=o*u);var h=e.getUint8(r++);h<128?h=c:c=h;var d=(240&h)>>4;if(d>=p.NoteOff&&d<=p.PitchBend){var f=15&h,g=void 0;switch(d){case p.NoteOff:case p.NoteOn:case p.PolyphonicPressure:(g=new y(u)).note=e.getUint8(r++),g.velocity=e.getUint8(r++),d===p.NoteOn&&a&&this.collectNoteStats(a,g,s);break;case p.Controller:(g=new S(u)).controller=e.getUint8(r++),g.value=e.getUint8(r++);break;case p.ProgramChange:(g=new C(u)).program=e.getUint8(r++);break;case p.ChannelPressure:(g=new k(u)).velocity=e.getUint8(r++);break;case p.PitchBend:(g=new M(u)).value=e.getUint16(r),r+=2;break;default:throw new Error("Unrecognized status byte: "+h)}l&&(g.absTimeSeconds=s),g.channelMessageType=d,g.channel=f,this.events.push(g)}else{if(h>=240&&h<=247)throw new Error("Not yet implemented");if(h>=248&&h<255)throw new Error("Not yet implemented");if(255===h){var E=new O(u);E.metaMessageType=e.getUint8(r++);var N=e.getUint8(r++);if(E.metaMessageType===v.EndOfTrack&&0===N&&(i=!0),E.metaMessageType===v.SetTempo&&3===N&&l&&this.header.pulsesPerQuarterNote)if(o=((e.getUint16(r)<<8)+e.getUint8(r+2))/(1e6*this.header.pulsesPerQuarterNote),a){var F=60/(o*this.header.pulsesPerQuarterNote);a.tempos.push(F),a.secondsPerTickValues.push(o)}l&&(E.absTimeSeconds=s),this.events.push(E),r+=N}}}}},{key:"collectNoteStats",value:function(e,t,n){var a=e.noteHistogram.get(t.note)||0;e.noteHistogram.set(t.note,a+1),n>e.lastNoteOnEventInSeconds&&(e.lastNoteOnEventInSeconds=n),(t.note>e.highNote||e.highNote===g.None)&&(e.highNote=t.note),(t.note<e.lowNote||e.lowNote===g.None)&&(e.lowNote=t.note)}}]),e}(),T=function(){function e(){Object(c.a)(this,e),this.chunks=[],this.header=void 0,this.tracks=[],this.midiStats=void 0,this.midiStats=this.getInitialMidiStats()}return Object(m.a)(e,[{key:"loadFromBuffer",value:function(e){this.chunks=[],this.midiStats=this.getInitialMidiStats();for(var t=0,n=new DataView(e);t<e.byteLength;){var a=P(e,t,t+4);t+=4;var r=n.getUint32(t,!1),i=t+=4;switch(a){case"MThd":var s=new F(n,i,r);this.header=s,this.chunks.push(s);break;case"MTrk":var o=new w(this.chunks[0],n,i,r,this.midiStats);this.tracks.push(o),this.chunks.push(o)}t+=r}}},{key:"getHeader",value:function(){if(this.header)return this.header;throw new Error("No header found!")}},{key:"getTracks",value:function(){return this.tracks}},{key:"getInitialMidiStats",value:function(){return{noteHistogram:new Map,highNote:g.None,lowNote:g.None,lastNoteOnEventInSeconds:0,tempos:[],secondsPerTickValues:[]}}}]),e}();function P(e,t,n){var a=e.slice(t,n);return String.fromCharCode.apply(null,Array.from(new Uint8Array(a)))}var D=n(30);function B(e){var t=e.midiStats,n=t.highNote-t.lowNote+1;if(n<=0)return null;for(var a=e.width/n,i=[],s=[],o=0,l=n>30,c=t.lowNote;c<=t.highNote;c++){var m=g[c].replace("s","#"),u=(c-t.lowNote)*a,h=t.noteHistogram.get(c);if(h&&(i.push(r.createElement("rect",{key:c,x:u,width:a,y:0,height:h,fill:D.a.BLUE1},r.createElement("title",null,h))),h>o&&(o=h)),!l||!j(c,t)){var d=u+a;s.push(r.createElement("text",{key:c,transform:"rotate(-90,".concat(d,",0)"),x:d,y:0,fontSize:"10"},m))}}var p=(e.height-20)/o;return r.createElement("svg",{width:e.width,height:e.height},r.createElement("g",{transform:"translate(0 20) scale(1 "+p+")"},i),r.createElement("g",{transform:"translate(0 20)"},s))}function j(e,t){if(e>t.lowNote&&e<t.highNote)return e===t.lowNote+1||e===t.highNote-1||(e-t.lowNote)%2===0}var x=function(e){Object(h.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(c.a)(this,n),(a=t.call(this,e)).state={fileName:e.fileName,midiFile:e.midiFile},a}return Object(m.a)(n,[{key:"getCurrentFilename",value:function(){return this.state.fileName}},{key:"dropHandler",value:function(e){if(e.preventDefault(),e.dataTransfer.items){for(var t=0;t<e.dataTransfer.items.length;t++)if("file"===e.dataTransfer.items[t].kind){var n=e.dataTransfer.items[t].getAsFile();if(n){this.openFile(n);break}}}else for(var a=0;a<e.dataTransfer.files.length;a++){if(e.dataTransfer.files[a]){this.openFile(e.dataTransfer.files[a]);break}}}},{key:"handleInputChange",value:function(e){var t=e.currentTarget;t.files&&t.files.length>0&&t.files[0]&&this.openFile(t.files[0])}},{key:"openFile",value:function(e){var t=this;this.setState({fileName:e.name});var n=new FileReader;n.onload=function(){if(t.props.onFileLoaded&&n.result instanceof ArrayBuffer){var a=new T;a.loadFromBuffer(n.result),t.setState({midiFile:a}),t.props.onFileLoaded(e.name,a)}},n.readAsArrayBuffer(e)}},{key:"dragOverHandler",value:function(e){e.stopPropagation(),e.preventDefault()}},{key:"render",value:function(){var e,t=this,n=this.state.midiFile?r.createElement(d.h,{text:this.state.fileName,buttonText:"Replace",onInputChange:function(e){return t.handleInputChange(e)}}):r.createElement(d.h,{text:"Select a MIDI file",onInputChange:function(e){return t.handleInputChange(e)}});if(this.state.midiFile){var a=this.state.midiFile.midiStats,i="Tempo: "+a.tempos.map((function(e){return parseFloat(e.toFixed(2))})).join(", ")+" bpm";e=r.createElement(r.Fragment,null,r.createElement(d.i,null,r.createElement(d.s,{ellipsize:!0},this.state.fileName)),n,r.createElement(d.c,null,r.createElement("p",null,i,"; last note at ",a.lastNoteOnEventInSeconds.toFixed(2)," seconds "),r.createElement("p",null,"High Note: ",g[a.highNote],", Low Note: ",g[a.lowNote]," ")),r.createElement(B,{width:320,height:80,midiStats:a}))}else e=r.createElement(d.m,{icon:"import",title:"No file loaded",description:"Drag and drop or select a file below...",action:n});return r.createElement(d.d,{id:"drop_zone",onDrop:function(e){return t.dropHandler(e)},onDragOver:function(e){return t.dragOverHandler(e)},className:"mb-midiFilePicker"},e)}}]),n}(r.Component),A=function(){function e(){Object(c.a)(this,e)}return Object(m.a)(e,null,[{key:"GetJson",value:function(e){return JSON.stringify(e,G,4)}}]),e}();function G(e,t){switch(e){case"rawTimingData":case"header":case"chunks":return;case"timingScheme":return b[t];case"fileFormat":return E[t];case"channelMessageType":return p[t];case"note":return g[t];default:return t}}var I=n(28),R=(n(115),function(e){Object(h.a)(n,e);var t=Object(u.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).svgRefs=[],e.numPages=0,e.errors=[],e}return Object(m.a)(n,[{key:"getNumPages",value:function(){return this.numPages}},{key:"getSvg",value:function(e){var t=this.svgRefs[e];return t?t.outerHTML:null}},{key:"render",value:function(){var e=this;try{var t=this.paginateEvents();this.numPages=t.length;var n=this.props.musicBoxProfile,a=n.supportedNotes,i=n.contentWidthMm/(n.supportedNotes.length-1),s=(n.paperWidthMm-n.contentWidthMm)/2,o=new Map;Object(I.a)(a).sort().forEach((function(e,t){o.set(e,a.length-t-1)}));var l=0;return t.forEach((function(e){l+=(e.endTimeInSeconds-e.startTimeInSeconds)*n.millimetersPerSecond})),r.createElement(r.Fragment,null,r.createElement(d.c,{intent:this.errors?"danger":"success"},this.errors&&this.errors.map((function(e){return r.createElement("p",null,e)})),r.createElement("p",null,"Total paper length: ",l.toFixed(2)," mm, width: ",n.paperWidthMm," mm")),t.map((function(n){return r.createElement("div",{className:"mb-musicBoxSvgWrapper"},e.generateSvgForPage(t,n,o,i,s))})))}catch(c){return r.createElement(d.c,{intent:"danger"},r.createElement("p",null,"Error encountered"),r.createElement("p",null,JSON.stringify(c)))}}},{key:"generateSvgForPage",value:function(e,t,n,a,i){var s=this,o=(t.endTimeInSeconds-t.startTimeInSeconds)*this.props.musicBoxProfile.millimetersPerSecond,l=this.props.musicBoxProfile.paperWidthMm,c=o+(this.props.musicBoxProfile.holeDiameterMm>2?this.props.musicBoxProfile.holeDiameterMm:2),m=this.props.formatting,u=m&&!m.omitPageBoundaries||0===t.pageNum,h=m&&!m.omitPageBoundaries||t.pageNum===e.length-1;return r.createElement("svg",{key:t.pageNum,width:c+"mm",height:l+"mm",ref:function(e){s.svgRefs[t.pageNum]=e},xmlns:"http://www.w3.org/2000/svg"},r.createElement("g",null,m&&m.renderBorder&&r.createElement(r.Fragment,null,this.renderSvgLineMm(0!==t.pageNum||this.props.formatting.loopMode?0:this.calculateStartSkew(),0,o,0),this.renderSvgLineMm(0,l,o,l),u&&this.renderLeadingBorder(l,0===t.pageNum),h&&this.renderTrailingBorder(o,l,t.pageNum===e.length-1))),r.createElement("g",null,t.midiEvents.map((function(e,o){return function(e,t,n,a,i,s,o){var l=n.get(t.note)||0;return r.createElement("circle",{key:e,cx:(t.absTimeSeconds-i)*o.millimetersPerSecond+"mm",cy:s+l*a+"mm",r:o.holeDiameterMm/2+"mm",fill:"none",stroke:"black"})}("".concat(t.pageNum,"_").concat(o),e,n,a,t.startTimeInSeconds,i,s.props.musicBoxProfile)}))))}},{key:"renderLeadingBorder",value:function(e,t){if(t&&!this.props.formatting.loopMode){var n=this.calculateStartSkew();return this.renderSvgLineMm(n,0,0,e)}return this.renderJigsawJoiner(0,e)}},{key:"calculateStartSkew",value:function(){return this.props.formatting.startPaddingMm<10?this.props.formatting.startPaddingMm:10}},{key:"renderTrailingBorder",value:function(e,t,n){return n&&!this.props.formatting.loopMode?this.renderSvgLineMm(e,0,e,t):this.renderJigsawJoiner(e,t)}},{key:"renderSvgLineMm",value:function(e,t,n,a){return r.createElement("line",{x1:e+"mm",y1:t+"mm",x2:n+"mm",y2:a+"mm",stroke:"black"})}},{key:"renderJigsawJoiner",value:function(e,t){for(var n=this.props.musicBoxProfile,a=.3,i=.5,s=.5*(.5*(n.paperWidthMm-n.contentWidthMm-n.holeDiameterMm)),o=[{x:e,y:0},{x:e,y:s-a*s},{x:e+2,y:s-i*s},{x:e+2,y:s+i*s},{x:e,y:s+a*s},{x:e,y:t-s-a*s},{x:e+2,y:t-s-i*s},{x:e+2,y:t-s+i*s},{x:e,y:t-s+a*s},{x:e,y:t}],l=[],c=0;c<o.length-1;c++){var m=o[c],u=o[c+1];l.push(this.renderSvgLineMm(m.x,m.y,u.x,u.y))}return r.createElement(r.Fragment,null,l)}},{key:"paginateEvents",value:function(){var e=[],t=this.props.musicBoxProfile.supportedNotes,n=new Set(t),a=new Map;Object(I.a)(t).sort().forEach((function(e,n){a.set(e,t.length-n-1)}));var r=[],i=[];this.errors=[],this.props.midiFile.getTracks()||this.errors.push("No tracks found!"),this.filterNotes(n,r,i),i.length>0&&this.errors.push("Unsupported notes found: ".concat(i.length," total. Inspect MIDI file or music box profile"));var s=this.props.formatting,o=this.props.musicBoxProfile,l=1/0;s.pageWidthMm>0&&(l=s.pageWidthMm/this.props.musicBoxProfile.millimetersPerSecond);var c={startTimeInSeconds:-(s.startPaddingMm+.5*o.holeDiameterMm)/o.millimetersPerSecond,endTimeInSeconds:0,midiEvents:[],pageNum:0};e.push(c);for(var m=.5*o.holeDiameterMm/o.millimetersPerSecond,u=o.minNoteGapMm/o.millimetersPerSecond,h=0,d=new Map,p=0,f=null;h<r.length;){var g=r[h],v=c.startTimeInSeconds+l;if(f&&f.note===g.note&&g.absTimeSeconds<=f.absTimeSeconds+u){var E;d.set(g.note,null!==(E=d.get(g.note))&&void 0!==E?E:1),p++,h++}else{if(g.absTimeSeconds+.5*m>v){if(!f)throw new Error("Page size too small to handle gaps between notes.");var b=.5*(f.absTimeSeconds+g.absTimeSeconds),N=b>v?v:b;c.endTimeInSeconds=N,c={startTimeInSeconds:N,endTimeInSeconds:0,midiEvents:[],pageNum:c.pageNum+1},e.push(c),f=null}c.midiEvents.push(g),h++,f=g}}if(!f)throw new Error("No supported MIDI notes!");c.endTimeInSeconds=f.absTimeSeconds;var y=l-(c.endTimeInSeconds-c.startTimeInSeconds);return y>.5||l===1/0?c.endTimeInSeconds+=.5:y>0&&(c.endTimeInSeconds+=y),this.errors.push("".concat(p," notes skipped (too close). Try increasing mm/sec. MIDI may contain overlapping notes.")),e}},{key:"filterNotes",value:function(e,t,n){var a=this,r=this.props.midiFile.getHeader(),i=this.props.midiFile.getTracks(),s=(r.fileFormat===E.multiTrack?i[1]:i[0]).events.filter((function(e){return e instanceof y&&e.channelMessageType===p.NoteOn})),o=new Map,l=0,c=0;s.forEach((function(r){if(a.props.formatting.transposeOutOfRangeNotes&&!e.has(r.note)){if(!o.has(r.note)){for(var i=null,s=0,m=Array.from(e);s<m.length;s++){var u=m[s];if((u-r.note)%12===0){i=u;break}}i&&o.set(r.note,i)}var h=o.get(r.note);h&&(r.note=h,l++)}e.has(r.note)?(t.push(r),r.absTimeSeconds>c&&(c=r.absTimeSeconds)):n.push(r)})),this.errors.push("".concat(l," notes transposed."))}}]),n}(r.Component));var J={fifteenNote:{name:"15 Note",paperWidthMm:41,contentWidthMm:29,supportedNotes:[g.C4,g.D4,g.E4,g.F4,g.G4,g.A4,g.B4,g.C5,g.D5,g.E5,g.F5,g.G5,g.A5,g.B5,g.C6],holeDiameterMm:1.8,millimetersPerSecond:20,minNoteGapMm:3},thirtyNote:{name:"30 Note",paperWidthMm:70.1,contentWidthMm:58.25,supportedNotes:[g.C3,g.D3,g.G3,g.A3,g.B3,g.C4,g.D4,g.E4,g.F4,g.Fs4,g.G4,g.Gs4,g.A4,g.As4,g.B4,g.C5,g.Cs5,g.D5,g.Ds5,g.E5,g.F5,g.Fs5,g.G5,g.Gs5,g.A5,g.As5,g.B5,g.C6,g.D6,g.E6],holeDiameterMm:2,millimetersPerSecond:20,minNoteGapMm:3}},L=n(21),U=(n(40),n(8));function W(e){var t=Object(r.useState)(e.profile),n=Object(L.a)(t,2),a=n[0],s=n[1],o=[],c=function(t){o.push(i.a.createElement(d.l,{key:t,text:J[t].name,onClick:function(){return function(t){var n=Object(l.a)({},J[t]);s(n),e.onChange&&e.onChange(n)}(t)}}))};for(var m in J)c(m);var u=i.a.createElement(d.k,null,o," "),h=i.a.createElement(d.o,{content:u,position:U.a.BOTTOM},i.a.createElement(d.a,{icon:"document-open",text:"Select profile..."}));return i.a.createElement(d.d,{className:"mb-MusicBoxProfileEditor"},i.a.createElement(d.i,null,i.a.createElement("span",null,h," Music Box Profile: ",a.name)),i.a.createElement("div",{className:"mb-settingLayout"},i.a.createElement("div",{className:"mb-settingGroup"},i.a.createElement(d.j,null,"Paper width (mm)",i.a.createElement(d.n,{value:a.paperWidthMm,onValueChange:function(e,t){s(Object(l.a)({},a,{paperWidthMm:e}))}})),i.a.createElement(d.j,null,"Content width (mm)",i.a.createElement(d.n,{value:a.contentWidthMm,onValueChange:function(e,t){s(Object(l.a)({},a,{contentWidthMm:e}))}})),i.a.createElement(d.j,null,"Minimum Note Gap (mm)",i.a.createElement(d.n,{value:a.minNoteGapMm,onValueChange:function(e,t){s(Object(l.a)({},a,{minNoteGapMm:e}))}}))),i.a.createElement("div",{className:"mb-settingGroup"},i.a.createElement(d.j,null,"Millimeters per second",i.a.createElement(d.n,{value:a.millimetersPerSecond,onValueChange:function(e,t){s(Object(l.a)({},a,{millimetersPerSecond:e}))}})),i.a.createElement(d.j,null,"Hole diameter (mm)",i.a.createElement(d.n,{value:a.holeDiameterMm,onValueChange:function(e,t){s(Object(l.a)({},a,{holeDiameterMm:e}))}})),i.a.createElement(d.a,{onClick:function(){e.onChange&&e.onChange(a)}},"Apply")),i.a.createElement("div",{className:"mb-settingGroup"},i.a.createElement(d.c,null,"Supported Notes: ",a.supportedNotes.map((function(e){return g[e].replace("s","#")})).join(", ")))))}function V(e){var t=Object(r.useState)(e.options),n=Object(L.a)(t,2),a=n[0],s=n[1];return i.a.createElement(d.d,null,i.a.createElement(d.i,null,i.a.createElement("span",null,"SVG Formatting Options")),i.a.createElement("div",{className:"mb-settingLayout"},i.a.createElement("div",{className:"mb-settingGroup"},i.a.createElement(d.j,null,"Maximum Page width (mm)",i.a.createElement(d.n,{value:a.pageWidthMm,onValueChange:function(e){s(Object(l.a)({},a,{pageWidthMm:e}))}})),i.a.createElement(d.j,null,"Start padding (mm)",i.a.createElement(d.n,{value:a.startPaddingMm,onValueChange:function(e){s(Object(l.a)({},a,{startPaddingMm:e}))}})),i.a.createElement(d.a,{onClick:function(){e.onChange&&e.onChange(a)}},"Apply")),i.a.createElement("div",{className:"mb-settingGroup"},i.a.createElement(d.e,{checked:a.renderBorder,label:"Render border",onChange:function(){s(Object(l.a)({},a,{renderBorder:!a.renderBorder}))}}),i.a.createElement(d.e,{checked:a.omitPageBoundaries,label:"Omit page boundaries",onChange:function(){s(Object(l.a)({},a,{omitPageBoundaries:!a.omitPageBoundaries}))}}),i.a.createElement(d.e,{checked:a.transposeOutOfRangeNotes,label:"Transpose out of range notes",onChange:function(){s(Object(l.a)({},a,{transposeOutOfRangeNotes:!a.transposeOutOfRangeNotes}))}}),i.a.createElement(d.e,{checked:a.loopMode,label:"Loop mode",onChange:function(){s(Object(l.a)({},a,{loopMode:!a.loopMode}))}}))))}var H=[{asset:"Midi Icon",by:"Midi Synthesizer by Iconic from the Noun Project"}],q=function(e){Object(h.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(c.a)(this,n),(a=t.call(this,e)).musicBoxSvgRef=void 0,a.state={midiJson:"",midiDataAvailable:!1,musicBoxProfile:J.thirtyNote,musicBoxSvgFormatOptions:{pageWidthMm:200,startPaddingMm:10,renderBorder:!0,omitPageBoundaries:!1,transposeOutOfRangeNotes:!0,loopMode:!1},showMidiJson:!1},a.musicBoxSvgRef=null,a}return Object(m.a)(n,[{key:"render",value:function(){var e=this,t=H.map((function(e,t){return i.a.createElement("div",{key:t},i.a.createElement("span",null,e.asset,": "),i.a.createElement("span",null,e.by))})),n=i.a.createElement("div",{className:"mb-settingsTab-container"},i.a.createElement(x,{fileName:this.state.fileName,midiFile:this.state.midiFile,onFileLoaded:function(t,n){return e.onMidiDataLoaded(t,n)}})),a=i.a.createElement("div",{className:"mb-settingsTab-container"},i.a.createElement(W,{profile:this.state.musicBoxProfile,onChange:function(t){return e.setState(Object(l.a)({},e.state,{musicBoxProfile:t}))}})),r=i.a.createElement(i.a.Fragment,null);return r=i.a.createElement("div",{className:"mb-settingsTab-container"},i.a.createElement(V,{options:this.state.musicBoxSvgFormatOptions,onChange:function(t){return e.setState(Object(l.a)({},e.state,{musicBoxSvgFormatOptions:t}))}})),i.a.createElement("div",{className:"mb-appRoot"},i.a.createElement("div",{className:"mb-settingsArea"},i.a.createElement(d.r,{animate:!0,id:"settings-tabs",key:"settings-tabs",renderActiveTabPanelOnly:!0,vertical:!0},i.a.createElement(d.q,{id:"file-picker-tab",title:"MIDI File",panel:n}),i.a.createElement(d.q,{id:"paper-settings-tab",title:"Paper/Music Box Settings",panel:a}),i.a.createElement(d.q,{id:"format-settings-tab",title:"Layout/Pagination",panel:r}),i.a.createElement(d.r.Expander,null))),i.a.createElement(d.g,null),this.state.midiDataAvailable&&this.state.midiFile&&i.a.createElement("div",{className:"mb-musicBox-preview"},i.a.createElement(R,{ref:function(t){e.musicBoxSvgRef=t},musicBoxProfile:this.state.musicBoxProfile,formatting:this.state.musicBoxSvgFormatOptions,midiFile:this.state.midiFile,elementId:"mb-musicBoxSvg"})),i.a.createElement("div",{className:"mb-debugMessage-Container"},this.state.midiDataAvailable&&i.a.createElement(i.a.Fragment,null,i.a.createElement(d.b,{style:{minWidth:200}},i.a.createElement(d.a,{icon:"download",text:"Download SVG(s)",onClick:function(){e.downloadSvgs()}}),i.a.createElement(d.a,{onClick:function(){return e.toggleDebugMessage()}},this.state.showMidiJson?"Hide":"Show"," MIDI JSON"),i.a.createElement(d.a,{icon:"export",onClick:function(){return e.copyMidiJson()}},"Copy MIDI Json")),i.a.createElement(d.f,{isOpen:this.state.showMidiJson},i.a.createElement(d.p,{className:"mb-debugMessage"},this.state.midiJson)),i.a.createElement(d.g,null)),i.a.createElement(d.d,null,"Code is available in ",i.a.createElement("a",{href:"https://github.com/SabinT/musicbox-svg"},"github"),i.a.createElement("br",null),"Credits",i.a.createElement("br",null),t)))}},{key:"onMidiDataLoaded",value:function(e,t){this.setState({midiFile:t,fileName:e,midiJson:A.GetJson(t),midiDataAvailable:!0})}},{key:"downloadSvgs",value:function(){if(this.musicBoxSvgRef)for(var e=this.musicBoxSvgRef.getNumPages(),t=0;t<e;t++){var n=this.musicBoxSvgRef.getSvg(t);if(n){var a,r=new Blob([n],{type:"image/svg+xml;charset=utf-8"}),i=URL.createObjectURL(r),s=document.createElement("a");s.href=i;var o=null!==(a=this.state.fileName)&&void 0!==a?a:"musicBox";s.download="".concat(o,"_page_").concat(t,".svg"),document.body.appendChild(s),s.click(),document.body.removeChild(s)}}}},{key:"copyMidiJson",value:function(){navigator.clipboard.writeText(this.state.midiJson)}},{key:"toggleDebugMessage",value:function(){this.setState(Object(l.a)({},this.state,{showMidiJson:!this.state.showMidiJson}))}}]),n}(i.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(q,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},40:function(e,t,n){},80:function(e,t,n){e.exports=n(116)},85:function(e,t,n){},86:function(e,t,n){},87:function(e,t,n){}},[[80,1,2]]]);
//# sourceMappingURL=main.dcd86a1e.chunk.js.map