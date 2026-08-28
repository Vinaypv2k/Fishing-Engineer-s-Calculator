const $=id=>document.getElementById(id),N=id=>Number($(id).value)||0,F=x=>x.toLocaleString(undefined,{maximumFractionDigits:3}),CAP=d=>d*d/1029.4,ANN=(D,d)=>(D*D-d*d)/1029.4,BF=m=>1-m/65.5;
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.page).classList.add("active")});
function calcWell(){let md=N("wMD"),tvd=N("wTVD"),mw=N("wMW"),inc=N("wInc");let hp=.052*mw*tvd,bf=BF(mw);
$("wellOut").innerHTML=`<h4>Calculation Steps</h4>
1. Hydrostatic pressure = 0.052 × MW × TVD<br>
&nbsp;&nbsp;= 0.052 × ${F(mw)} × ${F(tvd)} = <b>${F(hp)} psi</b><br>
2. Buoyancy factor = 1 − MW / 65.5<br>
&nbsp;&nbsp;= 1 − ${F(mw)} / 65.5 = <b>${F(bf)}</b><br>
3. Inclination = <b>${F(inc)}°</b>`;sync()}
function sync(){let md=N("wMD"),tvd=N("wTVD"),mw=N("wMW");$("kmd").textContent=md?F(md)+" ft":"—";$("ktvd").textContent=tvd?F(tvd)+" ft":"—";$("kmw").textContent=mw?F(mw)+" ppg":"—";$("kbf").textContent=mw?F(BF(mw)):"—";$("wellBadge").textContent=md?"WELL MODEL ACTIVE":"UNSAVED WELL"}
let comps=[];
function addComp(){let name=$("tName").value||"Component",o=N("tOD"),i=N("tID"),p=N("tPPF"),l=N("tLen");if(!(o>i&&p>0&&l>0))return alert("Enter valid component data.");comps.push({name,o,i,p,l});renderComps()}
function clearComp(){comps=[];renderComps()}function renderComps(){let tb=$("compBody"),aw=0,v=0,L=0;tb.innerHTML="";comps.forEach((x,k)=>{let a=x.p*x.l,z=CAP(x.i)*x.l;aw+=a;v+=z;L+=x.l;tb.innerHTML+=`<tr><td>${x.name}</td><td>${x.o}</td><td>${x.i}</td><td>${x.p}</td><td>${x.l}</td><td>${F(a)}</td><td>${F(z)}</td><td><button onclick="comps.splice(${k},1);renderComps()">×</button></td></tr>`});let bw=aw*BF(N("wMW"));$("stringOut").innerHTML=comps.length?`<h4>Calculation Steps</h4>
1. Component air weight = lb/ft × length; total = <b>${F(aw)} lb</b><br>
2. Buoyancy factor = 1 − MW/65.5 = <b>${F(BF(N("wMW")))}</b><br>
3. Buoyed weight = air weight × BF = ${F(aw)} × ${F(BF(N("wMW")))} = <b>${F(bw)} lb</b><br>
4. Component internal volume = ID²/1029.4 × length; total = <b>${F(v)} bbl</b><br>
5. Total string length = <b>${F(L)} ft</b>`:"No components.";sync()}
function calcTubular(){let o=N("uOD"),i=N("uID"),y=N("uY"),e=N("uEff")/100,sf=N("uSF"),pi=N("uPi"),po=N("uPo"),ax=N("uAx");if(!(o>i&&y>0))return $("tubOut").textContent="Enter valid tubular data.";let A=Math.PI/4*(o*o-i*i),yieldL=A*y,allow=Math.min(yieldL,yieldL*e)*sf,hoop=2*(o-i)*y/o;let axMargin=allow-Math.abs(ax),bMargin=hoop-pi,cMargin=hoop-po;$("tubOut").innerHTML=`<h4>Calculation Steps</h4>
1. Metal area = π/4 × (OD² − ID²)<br>
&nbsp;&nbsp;= π/4 × (${F(o)}² − ${F(i)}²) = <b>${F(A)} in²</b><br>
2. Pipe-body axial yield = area × SMYS<br>
&nbsp;&nbsp;= ${F(A)} × ${F(y)} = <b>${F(yieldL)} lb</b><br>
3. Connection-adjusted capacity = yield × efficiency<br>
&nbsp;&nbsp;= ${F(yieldL)} × ${F(e*100)}% = <b>${F(yieldL*e)} lb</b><br>
4. Design allowable = adjusted capacity × safety factor<br>
&nbsp;&nbsp;= ${F(yieldL*e)} × ${F(sf)} = <b>${F(allow)} lb</b><br>
5. Axial margin = allowable − applied load = <b class="${axMargin>=0?"ok":"bad"}">${F(axMargin)} lb</b><br>
6. Simplified pressure reference = 2 × (OD−ID) × SMYS / OD = <b>${F(hoop)} psi</b><br>
7. Internal margin = reference − internal pressure = <b class="${bMargin>=0?"ok":"bad"}">${F(bMargin)} psi</b><br>
8. External margin = reference − external pressure = <b class="${cMargin>=0?"ok":"bad"}">${F(cMargin)} psi</b>`;$("kpull").textContent=F(axMargin)+" lb";$("pbar").style.width=Math.max(0,Math.min(100,ax/allow*100))+"%";$("pstatus").textContent=axMargin>=0?"Within screening axial envelope":"AXIAL LOAD EXCEEDS SCREENING ALLOWABLE";$("status").textContent=axMargin>=0?"Screening checks OK":"Review load envelope"}
function calcFree(){let f1=N("fL1"),f2=N("fL2"),s1=N("fS1"),s2=N("fS2"),L=N("fLen"),o=N("fOD"),i=N("fID");if(!(f2>f1&&s2>s1&&L>0&&o>i))return $("freeOut").textContent="Enter valid test data.";let A=Math.PI/4*(o*o-i*i),df=f2-f1,ds=s2-s1,exp=df*(L*12)/(A*30e6),pct=ds/exp*100;$("freeOut").innerHTML=`<h4>Calculation Steps</h4>
1. Load increment = Load₂ − Load₁ = ${F(f2)} − ${F(f1)} = <b>${F(df)} lb</b><br>
2. Observed stretch increment = Stretch₂ − Stretch₁ = ${F(s2)} − ${F(s1)} = <b>${F(ds)} in</b><br>
3. Metal area = π/4 × (OD² − ID²) = <b>${F(A)} in²</b><br>
4. Free-pipe stretch = ΔF × L / (A × E)<br>
&nbsp;&nbsp;= ${F(df)} × ${F(L*12)} / (${F(A)} × 30,000,000) = <b>${F(exp)} in</b><br>
5. Elastic response = observed / calculated × 100 = <b>${F(pct)}%</b><br>
<span class="${pct>80?"ok":"warn"}">${pct>80?"High response — likely free/near-free section":"Low response — possible stuck/partial-free section"}</span>`}
function calcJar(){let wt=N("jWt"),hook=N("jHook"),allow=N("jAllow"),sf=N("jSF"),eff=N("jEff")/100,imp=N("jImp")/100;let allowable=allow*sf,margin=allowable-hook,impact=Math.max(0,margin)*eff*imp;$("jarOut").innerHTML=`<h4>Calculation Steps</h4>
1. Design allowable hookload = pipe allowable × safety factor = ${F(allow)} × ${F(sf)} = <b>${F(allowable)} lb</b><br>
2. Available overpull = allowable hookload − current hookload = ${F(allowable)} − ${F(hook)} = <b class="${margin>=0?"ok":"bad"}">${F(margin)} lb</b><br>
3. Effective jar load = overpull × jar efficiency = ${F(Math.max(0,margin))} × ${F(eff*100)}%<br>
4. Screening impact load = effective jar load × impact factor = <b>${F(impact)} lb</b>`;$("kpull").textContent=F(margin)+" lb"}
function calcHyd(){let q=N("hQ"),id=N("hID"),ad=N("hAD"),L=N("hPL"),al=N("hAL"),pv=N("hPV"),yp=N("hYP");if(!(q>0&&id>0&&ad>id))return $("hydOut").textContent="Enter valid hydraulics data.";let vp=q/(2.448*id*id),va=q/(2.448*(ad*ad-id*id));let dpP=.0000768*pv*L*q/(id**4)+.0000068*yp*L/id,dpA=.0000768*pv*al*q/((ad-id)**4)+.0000068*yp*al/(ad-id),tot=dpP+dpA;$("hydOut").innerHTML=`<h4>Calculation Steps</h4>
1. Pipe velocity = Q / (2.448 × ID²) = ${F(q)} / (2.448 × ${F(id)}²) = <b>${F(vp)} ft/s</b><br>
2. Annular velocity = Q / [2.448 × (Annulus ID² − Pipe ID²)] = <b>${F(va)} ft/s</b><br>
3. Pipe pressure loss = PV term + YP term = <b>${F(dpP)} psi</b><br>
4. Annulus pressure loss = PV term + YP term = <b>${F(dpA)} psi</b><br>
5. Total friction = pipe ΔP + annulus ΔP = ${F(dpP)} + ${F(dpA)} = <b>${F(tot)} psi</b>`;$("kfric").textContent=F(tot)+" psi"}
function calcSpot(){let D=N("sHole"),o=N("sOD"),V=N("sVol"),R=N("sRate"),m1=N("sMW1"),m2=N("sMW2"),t=N("sTVD"),d1=N("sDP1"),d2=N("sDP2"),sp=N("sSP");if(!(D>o&&V>0&&R>0&&m1>0&&m2>0&&t>0))return $("spotOut").textContent="Enter valid spotting data.";let c=ANN(D,o),len=V/c,hyd1=.052*m1*t,hyd2=.052*m2*t,fr=d1+d2,bhp=sp+hyd2+fr;$("spotOut").innerHTML=`<h4>Calculation Steps</h4>
1. Annular capacity = (Hole ID² − String OD²) / 1029.4 = <b>${F(c)} bbl/ft</b><br>
2. Pill length = volume / annular capacity = ${F(V)} / ${F(c)} = <b>${F(len)} ft</b><br>
3. Pumping time = volume / rate = ${F(V)} / ${F(R)} = <b>${F(V/R)} min</b><br>
4. Base hydrostatic = 0.052 × ${F(m1)} × ${F(t)} = <b>${F(hyd1)} psi</b><br>
5. Pill hydrostatic = 0.052 × ${F(m2)} × ${F(t)} = <b>${F(hyd2)} psi</b><br>
6. Hydrostatic change = ${F(hyd2)} − ${F(hyd1)} = <b>${F(hyd2-hyd1)} psi</b><br>
7. Hydraulic friction = string ΔP + annulus ΔP = <b>${F(fr)} psi</b><br>
8. Screening pumping BHP = surface pressure + pill hydrostatic + friction<br>
&nbsp;&nbsp;= ${F(sp)} + ${F(hyd2)} + ${F(fr)} = <b>${F(bhp)} psi</b>`;$("kbphp").textContent=F(bhp)+" psi"}
function resetAll(){if(confirm("Reset all inputs and calculations?"))location.reload()}sync();