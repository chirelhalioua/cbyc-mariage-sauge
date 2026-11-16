<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const weddingDate = new Date('2027-09-18T16:00:00')
const now = ref(new Date())
let countdownTimer: ReturnType<typeof setInterval> | undefined
let revealObserver: IntersectionObserver | undefined
onMounted(() => {
  countdownTimer = setInterval(() => { now.value = new Date() }, 1000)
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        revealObserver?.unobserve(entry.target)
      }
    })
  }, { threshold: 0.14 })
  document.querySelectorAll('.sage-model main > section:not(.cover)').forEach((section) => {
    section.classList.add('reveal-on-scroll')
    revealObserver?.observe(section)
  })
})
onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
  revealObserver?.disconnect()
})
const countdown = computed(() => { const ms = Math.max(0, weddingDate.getTime() - now.value.getTime()); return { days: Math.floor(ms / 86400000), hours: Math.floor(ms % 86400000 / 3600000), minutes: Math.floor(ms % 3600000 / 60000), seconds: Math.floor(ms % 60000 / 1000) } })
const guestName = ref('')
const email = ref('')
const attendance = ref('oui')
const guests = ref('2')
const guestsOpen = ref(false)
function chooseGuests(value: string) { guests.value = value; guestsOpen.value = false }
const note = ref('')
const sent = ref(false)

function sendReply() {
  if (!guestName.value.trim() || !email.value.trim()) return
  sent.value = true
}
</script>

<template>
  <main class="sage-model">
    <header class="site-header">
      <a class="brand" href="#top">É<span>·</span>A</a>
      <nav><a href="#details">La célébration</a><a href="#programme">Programme</a><a href="#countdown">Décompte</a><a href="#map">Carte</a><a href="#reply">Réponse</a></nav>
      <a class="header-date" href="#practical">18 SEPT. 2027</a>
    </header>

    <section id="top" class="cover">
      <div class="cover-copy">
        <p class="kicker">UNE JOURNÉE À CÉLÉBRER ENSEMBLE</p>
        <p class="script">Le début d'une belle aventure</p>
        <h1>Élise <i>&</i><br>Antoine</h1>
        <div class="fine-line"><span></span> ✳ <span></span></div>
        <p class="date-line">SAMEDI 18 SEPTEMBRE 2027 <b>·</b> PROVENCE</p>
        <a class="pill-link" href="#details">Découvrir l'invitation <span>↓</span></a>
      </div>
      <div class="cover-art">
        <div class="arch-photo"></div>
        <div class="cover-stamp">E<br><small>&</small><br>A</div>
        <span class="photo-note">L'AMOUR, TOUT SIMPLEMENT</span>
      </div>
      <div class="cover-bottom"><span>18 — 09 — 2027</span><span>MAS DES OLIVIERS · PROVENCE</span></div>
    </section>

    <section class="welcome section">
      <p class="kicker">AVEC JOIE ET ÉMOTION</p>
      <p class="script">Nous avons une merveilleuse nouvelle…</p>
      <h2>Nous nous disons <em>oui.</em></h2>
      <p class="body-copy">Et nous serions tellement heureux de partager cette journée unique avec vous. Gardez cette date précieusement : votre présence sera notre plus beau cadeau.</p>
      <div class="olive-branch">❧</div>
    </section>

    <section id="details" class="celebration section">
      <div class="section-title"><p class="kicker">LE GRAND JOUR</p><p class="script">Un moment, mille souvenirs</p><h2>Rendez-vous <em>en Provence</em></h2></div>
      <div class="celebration-grid">
        <div class="celebration-image"></div>
        <div class="celebration-text">
          <p class="script">Samedi 18 septembre 2027</p>
          <h3>Le Mas des Oliviers</h3>
          <p>Une parenthèse au milieu des oliviers, sous la lumière douce de Provence, pour célébrer l'amour et profiter de chaque instant.</p>
          
          <a class="text-link" href="#practical">Toutes les informations ↗</a>
        </div>
      </div>
    </section>

    <section id="programme" class="programme-section section">
      <div class="section-title"><span class="tag optional">Option personnalisable</span><p class="kicker">LE FIL DE LA JOURNÉE</p><p class="script">Chaque instant a son importance</p><h2>Le programme <em>des festivités</em></h2><p class="programme-intro">Découvrez les grands rendez-vous de cette journée, imaginés pour profiter pleinement de chaque moment.</p></div>
      <div class="timeline">
        <article class="timeline-item"><div class="timeline-time">16h00</div><div class="timeline-marker">✦</div><div class="timeline-content"><span>01 · SE RETROUVER</span><h3>La cérémonie</h3><p>Le grand moment où Élise & Antoine se diront oui, entourés de leurs proches.</p></div></article>
        <article class="timeline-item"><div class="timeline-time">18h00</div><div class="timeline-marker">✧</div><div class="timeline-content"><span>02 · PARTAGER</span><h3>Le cocktail</h3><p>Un moment convivial au jardin pour trinquer, échanger et profiter de la douceur provençale.</p></div></article>
        <article class="timeline-item"><div class="timeline-time">20h30</div><div class="timeline-marker">♡</div><div class="timeline-content"><span>03 · CÉLÉBRER</span><h3>Le dîner & la soirée</h3><p>Un dîner festif, suivi d'une soirée pour danser et célébrer ensemble.</p></div></article>
      </div>
      <p class="timeline-note">Exemple de programme — les horaires et les étapes sont entièrement personnalisables.</p>
    </section>

    <section id="countdown" class="countdown-section"><span class="tag optional">Option personnalisable</span><p class="script">Le grand jour approche</p><h2>Plus que quelques <em>instants…</em></h2><div class="countdown-grid"><div><strong>{{ countdown.days }}</strong><span>JOURS</span></div><div><strong>{{ String(countdown.hours).padStart(2, '0') }}</strong><span>HEURES</span></div><div><strong>{{ String(countdown.minutes).padStart(2, '0') }}</strong><span>MINUTES</span></div><div><strong>{{ String(countdown.seconds).padStart(2, '0') }}</strong><span>SECONDES</span></div></div><p class="countdown-caption">Un décompte animé, ajusté à la date de votre événement.</p></section><section class="quote-band"><span>“</span><p class="script">Le bonheur n'a de sens que lorsqu'il est partagé.</p><small>ÉLISE & ANTOINE</small></section>

    <section id="practical" class="practical section">
      <div class="section-title"><p class="kicker">POUR PRÉPARER VOTRE VENUE</p><p class="script">Quelques détails pratiques</p><h2>Tout simplement <em>l'essentiel</em></h2></div>
      <p class="legend"><span><i class="dot green"></i> Inclus dans la formule</span><span><i class="dot rose"></i> Option en supplément</span></p>
    </section>
    <section id="map" class="map-section section"><div class="section-title"><span class="tag optional">Option personnalisable</span><p class="kicker">TOUS LES CHEMINS MÈNENT À NOUS</p><p class="script">Retrouvez-nous facilement</p><h2>La carte de <em>notre journée</em></h2><p class="map-intro">Une carte interactive personnalisée peut réunir tous les lieux utiles à vos invités : cérémonie, réception, hébergement et stationnement.</p></div><div class="map-frame"><iframe title="Carte du secteur d'Aix-en-Provence" src="https://www.google.com/maps?q=Aix-en-Provence&output=embed" loading="lazy"></iframe></div><div class="map-links"><a href="https://www.google.com/maps/search/?api=1&query=Mas+des+Oliviers+Aix-en-Provence" target="_blank" rel="noopener noreferrer">Itinéraire vers le lieu ↗</a><span>Exemple de carte — les adresses seront personnalisées pour chaque événement.</span></div></section>
    <section id="reply" class="reply-section">
      <p class="kicker">NOUS AVONS HÂTE DE VOUS RETROUVER</p>
      <p class="script">Un petit mot de votre part</p>
      <h2>Serez-vous <em>à nos côtés ?</em></h2>
      <p class="reply-intro">Merci de nous faire part de votre réponse avant le 1er septembre 2027.</p>
      <form v-if="!sent" @submit.prevent="sendReply">
        <label>Nom et prénom<input v-model="guestName" required placeholder="Votre nom"></label>
        <label>Adresse e-mail<input v-model="email" type="email" required placeholder="vous@exemple.fr"></label>
        <fieldset><legend>Votre réponse</legend><label class="choice"><input v-model="attendance" type="radio" value="oui"> Avec plaisir, je serai présent(e)</label><label class="choice"><input v-model="attendance" type="radio" value="non"> Je ne pourrai malheureusement pas venir</label></fieldset>
        <div class="guest-picker">
          <span class="field-label">Nombre de personnes</span>
          <button class="guest-trigger" type="button" :aria-expanded="guestsOpen" @click="guestsOpen = !guestsOpen">
            <span>{{ guests }} {{ guests === '1' ? 'personne' : 'personnes' }}</span><span class="guest-chevron" :class="{ open: guestsOpen }">⌄</span>
          </button>
          <div v-if="guestsOpen" class="guest-options">
            <button v-for="count in ['1','2','3','4']" :key="count" type="button" :class="{ selected: guests === count }" @click="chooseGuests(count)">
              <span>{{ count }} {{ count === '1' ? 'personne' : 'personnes' }}</span><span class="guest-check">{{ guests === count ? '✓' : '' }}</span>
            </button>
          </div>
        </div>
        <label>Un petit mot (facultatif)<textarea v-model="note" rows="3" placeholder="Une pensée pour les futurs mariés…"></textarea></label>
        <button type="submit">Envoyer ma réponse <span>♡</span></button>
      </form>
      <div v-else class="success"><h3>Merci {{ guestName }} !</h3><p>Votre réponse a bien été prise en compte dans cette démonstration.</p></div>
      <small class="demo-note">Modèle de démonstration : le formulaire n'enregistre et n'envoie pas encore les réponses.</small>
    </section>
    <footer><div class="footer-brand">É <span>&</span> A</div><p class="script">À très bientôt pour célébrer l'amour</p><small>INVITATION IMAGINÉE AVEC <a href="https://www.cbyc-invitations.fr/" target="_blank" rel="noopener noreferrer">C BY C</a></small></footer>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Italiana&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
.sage-model{--sage:#687764;--sage-dark:#465342;--cream:#f5f2e9;--paper:#fbfaf6;--ink:#34392f;--muted:#77796f;--rose:#b77c82;background:var(--paper);color:var(--ink);font-family:'DM Sans',sans-serif;font-weight:300}
.sage-model *{box-sizing:border-box}.sage-model a{color:inherit;text-decoration:none}.sage-model .site-header{height:78px;padding:0 7%;display:flex;align-items:center;justify-content:space-between;background:var(--paper);letter-spacing:.12em;font-size:10px}.sage-model .brand,.sage-model .footer-brand{font-family:'Italiana',serif;font-size:27px;letter-spacing:0}.sage-model .brand span,.sage-model .footer-brand span{color:var(--rose)}.sage-model nav{display:flex;gap:34px}.sage-model nav a,.sage-model .header-date{transition:color .2s}.sage-model nav a:hover,.sage-model .header-date:hover{color:var(--sage)}
.sage-model .cover{min-height:660px;background:var(--cream);position:relative;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:65px 10% 95px;overflow:hidden}.sage-model .cover-copy{text-align:center;z-index:1}.sage-model .kicker{font-size:9px;letter-spacing:.24em;color:var(--sage);font-weight:600}.sage-model .script{font-family:'Playfair Display',serif;font-style:italic;color:var(--sage);font-size:22px}.sage-model h1{font:400 clamp(64px,8vw,112px)/.95 'Italiana',serif;letter-spacing:-.04em;margin:20px 0}.sage-model h1 i{font:italic 400 .65em 'Playfair Display',serif;color:var(--sage)}.sage-model .fine-line{display:flex;align-items:center;justify-content:center;gap:12px;color:var(--sage);margin:24px auto}.sage-model .fine-line span{height:1px;width:52px;background:#aeb5a4}.sage-model .date-line{font-size:9px;letter-spacing:.18em}.sage-model .date-line b{color:var(--rose);padding:0 7px}.sage-model .pill-link{display:inline-flex;gap:24px;align-items:center;margin-top:35px;padding:14px 22px;border:1px solid #aab09f;border-radius:30px;font-size:10px;letter-spacing:.08em}.sage-model .pill-link span{font-size:16px}.sage-model .cover-art{height:470px;position:relative;display:flex;justify-content:center;align-items:center}.sage-model .arch-photo{width:76%;height:100%;border-radius:48% 48% 0 0;background:linear-gradient(0deg,#41483b22,#41483b11),url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&q=85') center/cover;box-shadow:18px 18px 0 #dce0d3}.sage-model .cover-stamp{position:absolute;left:2%;bottom:13%;width:92px;height:92px;border-radius:50%;background:var(--sage);color:white;display:grid;place-content:center;text-align:center;font:24px 'Italiana',serif;line-height:.8;box-shadow:0 6px 24px #34392f22}.sage-model .cover-stamp small{font:italic 13px 'Playfair Display',serif}.sage-model .photo-note{position:absolute;right:-2%;bottom:4%;font-size:8px;letter-spacing:.2em;writing-mode:vertical-rl}.sage-model .cover-bottom{position:absolute;bottom:25px;left:10%;right:10%;display:flex;justify-content:space-between;font-size:8px;letter-spacing:.2em;color:var(--muted)}
.sage-model .section{padding:100px 10%}.sage-model .welcome{text-align:center;max-width:850px;margin:auto}.sage-model h2{font:400 clamp(38px,5vw,58px)/1.08 'Italiana',serif;margin:14px 0 22px}.sage-model h2 em{font-family:'Playfair Display',serif;color:var(--sage);font-weight:400}.sage-model .body-copy{max-width:560px;margin:0 auto;color:var(--muted);font-size:13px;line-height:2}.sage-model .olive-branch{font-size:42px;color:#a0aa95;margin-top:25px}
.sage-model .celebration{background:#f0f0e8}.sage-model .section-title{text-align:center;margin-bottom:55px}.sage-model .celebration-grid{display:grid;grid-template-columns:1fr 1fr;gap:9%;align-items:center;max-width:1050px;margin:auto}.sage-model .celebration-image{height:470px;background:url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&q=85') center/cover}.sage-model .celebration-text h3{font:400 30px 'Italiana',serif;margin:10px 0}.sage-model .celebration-text>p:not(.script){font-size:13px;line-height:2;color:var(--muted)}.sage-model .text-link,.sage-model .practical-grid article>a{font-size:11px;color:var(--sage-dark);border-bottom:1px solid #9ca894;padding-bottom:4px}
.sage-model .programme-section{background:var(--paper)}.sage-model .programme-intro{max-width:560px;margin:0 auto;color:var(--muted);font-size:12px;line-height:1.9}.sage-model .timeline{max-width:820px;margin:0 auto;position:relative}.sage-model .timeline:before{content:"";position:absolute;left:145px;top:12px;bottom:20px;width:1px;background:#cbd2c4}.sage-model .timeline-item{display:grid;grid-template-columns:110px 70px 1fr;gap:0;position:relative;padding:0 0 38px}.sage-model .timeline-time{text-align:right;padding:7px 22px 0 0;color:var(--sage-dark);font:25px 'Italiana',serif}.sage-model .timeline-marker{z-index:1;width:28px;height:28px;border-radius:50%;background:#e8ebe1;border:1px solid #b9c3b2;color:var(--sage);display:grid;place-items:center;margin:4px auto;font-size:13px}.sage-model .timeline-content{padding:4px 0 0 18px}.sage-model .timeline-content>span{font-size:8px;letter-spacing:.18em;color:var(--sage);font-weight:600}.sage-model .timeline-content h3{font:27px 'Italiana',serif;margin:7px 0}.sage-model .timeline-content p{font-size:11px;line-height:1.9;color:var(--muted);margin:0;max-width:480px}.sage-model .timeline-note{text-align:center;color:#929388;font-size:9px;margin-top:12px}.sage-model .countdown-section{padding:82px 20px;text-align:center;background:#e8ebe1}.sage-model .countdown-grid{display:flex;justify-content:center;gap:clamp(20px,5vw,60px);margin:30px auto}.sage-model .countdown-grid div{display:flex;flex-direction:column;gap:7px}.sage-model .countdown-grid strong{font:clamp(38px,6vw,62px) 'Italiana',serif;color:var(--sage-dark)}.sage-model .countdown-grid span{font-size:8px;letter-spacing:.18em;color:var(--muted)}.sage-model .countdown-caption,.sage-model .map-intro{font-size:11px;color:var(--muted);line-height:1.9}.sage-model .map-section{background:#f0f0e8}.sage-model .map-frame{max-width:1000px;height:380px;margin:auto;border:8px solid white}.sage-model .map-frame iframe{width:100%;height:100%;border:0}.sage-model .map-links{max-width:1000px;margin:16px auto;display:flex;justify-content:space-between;font-size:10px;color:var(--muted)}.sage-model .map-links a{color:var(--sage-dark);text-decoration:underline}.sage-model .quote-band{background:var(--sage);color:white;text-align:center;padding:75px 20px}.sage-model .quote-band>span{font:60px 'Playfair Display',serif;line-height:.6}.sage-model .quote-band .script{color:white;font-size:27px}.sage-model .quote-band small{font-size:8px;letter-spacing:.2em}
.sage-model .practical{background:var(--paper)}.sage-model .practical-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:1100px;margin:auto}.sage-model .practical-grid article{position:relative;background:transparent;padding:30px 25px;min-height:0}.sage-model .tag{display:inline-block;padding:6px 10px;border-radius:20px;font-size:9px;letter-spacing:.08em}.sage-model .tag.included{background:#e0e8dc;color:#50634d}.sage-model .tag.optional{background:#f1e2e2;color:#99656a}.sage-model .card-icon{font:26px 'Italiana',serif;color:var(--sage);margin:20px 0 8px}.sage-model .practical-grid h3{font:24px 'Italiana',serif;margin:0 0 10px}.sage-model .practical-grid p{font-size:11px;line-height:1.8;color:var(--muted);min-height:58px}.sage-model .practical-grid article>a{display:inline-block;margin:7px 0 12px}.sage-model .practical-grid article>small{display:block;color:#898b81;font-size:9px;line-height:1.6}.sage-model .legend{display:flex;justify-content:center;gap:28px;margin:38px 0 0;font-size:10px;color:var(--muted)}.sage-model .legend span{display:flex;align-items:center;gap:8px}.sage-model .dot{width:8px;height:8px;border-radius:50%;display:inline-block}.sage-model .dot.green{background:#81947b}.sage-model .dot.rose{background:var(--rose)}
.sage-model .reply-section{background:var(--cream);padding:95px 20px;text-align:center}.sage-model .reply-intro{font-size:12px;color:var(--muted);margin-bottom:35px}.sage-model form{max-width:490px;margin:auto;text-align:left;display:grid;gap:16px}.sage-model form>label,.sage-model fieldset{display:grid;gap:8px;font-size:10px;letter-spacing:.06em;color:var(--sage-dark)}.sage-model input:not([type=radio]),.sage-model select,.sage-model textarea{width:100%;padding:13px 14px;border:1px solid #d8d9cf;background:#fbfaf6;font:12px 'DM Sans',sans-serif;color:var(--ink);border-radius:0}.sage-model fieldset{border:0;padding:0;margin:0}.sage-model fieldset legend{margin-bottom:10px}.sage-model .choice{display:flex;align-items:center;gap:10px;font-size:11px;color:var(--muted);letter-spacing:0}.sage-model .choice input{accent-color:var(--sage)}.sage-model form button{border:0;background:var(--sage);color:white;padding:15px;letter-spacing:.1em;font:11px 'DM Sans',sans-serif;cursor:pointer}.sage-model form button span{margin-left:8px}.sage-model .demo-note{display:block;margin-top:20px;color:#929388;font-size:9px}.sage-model .success{padding:30px}.sage-model .success h3{font:30px 'Italiana',serif}.sage-model footer{text-align:center;padding:45px 20px;background:#e8ebe1}.sage-model .footer-brand{font-size:35px}.sage-model footer .script{font-size:19px}.sage-model footer small{font-size:8px;letter-spacing:.18em}.sage-model footer a{color:var(--sage);text-decoration:underline;text-underline-offset:3px}
@media(max-width:700px){.sage-model .site-header{height:65px;padding:0 5%}.sage-model nav{gap:13px;font-size:8px}.sage-model .header-date{display:none}.sage-model .cover{grid-template-columns:1fr;padding:55px 7% 75px;gap:35px}.sage-model .cover-art{height:350px}.sage-model .arch-photo{width:78%}.sage-model .cover-bottom{left:7%;right:7%;font-size:7px}.sage-model .section{padding:75px 7%}.sage-model .celebration-grid{grid-template-columns:1fr;gap:30px}.sage-model .celebration-image{height:330px}.sage-model .practical-grid{grid-template-columns:1fr 1fr}.sage-model .practical-grid article{padding:22px 17px;min-height:260px}.sage-model .legend{flex-wrap:wrap;gap:12px}.sage-model .quote-band .script{font-size:22px}}
@media(max-width:700px){.sage-model .timeline:before{left:91px}.sage-model .timeline-item{grid-template-columns:70px 42px 1fr}.sage-model .timeline-time{font-size:21px;padding-right:12px}.sage-model .timeline-content{padding-left:12px}.sage-model .timeline-content h3{font-size:23px}}\n@media(max-width:420px){.sage-model nav{gap:9px}.sage-model nav a{font-size:7px}.sage-model .practical-grid{grid-template-columns:1fr}.sage-model .practical-grid article{min-height:0}.sage-model .practical-grid p{min-height:0}.sage-model .cover-art{height:300px}}

/* Animations visibles et élégantes */
.sage-model .cover-copy{animation:heroCopyIn 1.15s cubic-bezier(.2,.75,.25,1) both}
.sage-model .cover-art{animation:heroImageIn 1.35s .12s cubic-bezier(.2,.75,.25,1) both}
.sage-model .cover-stamp{animation:stampPop .8s .85s both}
.sage-model .fine-line span{animation:lineGrow 1.1s .7s both;transform-origin:center}
.sage-model .arch-photo{animation:photoFloat 6s ease-in-out 1.5s infinite}
.sage-model .reveal-on-scroll{opacity:0;transform:translateY(48px);transition:opacity .9s ease,transform .9s cubic-bezier(.2,.7,.2,1)}
.sage-model .reveal-on-scroll.is-visible{opacity:1;transform:translateY(0)}
.sage-model .timeline-item{opacity:0;transform:translateX(-24px);transition:opacity .7s ease,transform .7s ease}
.sage-model .is-visible .timeline-item{opacity:1;transform:translateX(0)}
.sage-model .is-visible .timeline-item:nth-child(2){transition-delay:.18s}
.sage-model .is-visible .timeline-item:nth-child(3){transition-delay:.36s}
.sage-model .countdown-grid strong{display:inline-block;animation:numberFloat 2.8s ease-in-out infinite}
.sage-model .countdown-grid div:nth-child(2) strong{animation-delay:.2s}
.sage-model .countdown-grid div:nth-child(3) strong{animation-delay:.4s}
.sage-model .countdown-grid div:nth-child(4) strong{animation-delay:.6s}
.sage-model .pill-link,.sage-model form button{transition:transform .3s ease,box-shadow .3s ease,background .3s ease}
.sage-model .pill-link:hover,.sage-model form button:hover{transform:translateY(-4px);box-shadow:0 12px 25px #46534225}
.sage-model .practical-grid article{transition:transform .35s ease,background .35s ease}
.sage-model .practical-grid article:hover{transform:translateY(-7px);background:#eef0e8}
@keyframes heroCopyIn{from{opacity:0;transform:translateY(35px)}to{opacity:1;transform:translateY(0)}}
@keyframes heroImageIn{from{opacity:0;transform:translateX(45px) scale(.96)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes stampPop{0%{opacity:0;transform:scale(.5) rotate(-18deg)}75%{transform:scale(1.12) rotate(5deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes lineGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes photoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes numberFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@media(prefers-reduced-motion:reduce){.sage-model *, .sage-model *::before,.sage-model *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}.sage-model .reveal-on-scroll{opacity:1;transform:none}}
\n
.sage-model .guest-picker{position:relative;display:grid;gap:8px}
.sage-model .field-label{font-size:10px;letter-spacing:.06em;color:var(--sage-dark)}
.sage-model .guest-trigger{width:100%;display:flex;align-items:center;justify-content:space-between;padding:15px 16px;border:1px solid #cbd2c4;background:#fbfaf6;color:var(--ink);font:13px 'DM Sans',sans-serif;text-align:left;cursor:pointer;transition:border-color .25s,box-shadow .25s}
.sage-model .guest-trigger:hover,.sage-model .guest-trigger[aria-expanded=true]{border-color:var(--sage);box-shadow:0 5px 18px #46534212}
.sage-model .guest-chevron{font-size:21px;color:var(--sage);transition:transform .25s}
.sage-model .guest-chevron.open{transform:rotate(180deg)}
.sage-model .guest-options{position:absolute;z-index:5;left:0;right:0;top:calc(100% + 5px);padding:7px;background:#fbfaf6;border:1px solid #d9ded3;box-shadow:0 14px 35px #34392f20;animation:guestMenuIn .18s ease-out}
.sage-model .guest-options button{width:100%;display:flex;align-items:center;justify-content:space-between;padding:13px 12px;border:0;border-bottom:1px solid #eceee7;background:transparent;color:var(--ink);font:12px 'DM Sans',sans-serif;text-align:left;cursor:pointer;transition:background .2s,color .2s}
.sage-model .guest-options button:last-child{border-bottom:0}
.sage-model .guest-options button:hover,.sage-model .guest-options button.selected{background:#e8ebe1;color:var(--sage-dark)}
.sage-model .guest-check{width:22px;height:22px;border:1px solid #bdc7b7;border-radius:50%;display:grid;place-items:center;color:white;font-size:12px}
.sage-model .guest-options button.selected .guest-check{background:var(--sage);border-color:var(--sage)}
@keyframes guestMenuIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
\n</style>
