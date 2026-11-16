<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const weddingDate = new Date('2027-09-18T16:00:00')
const now = ref(new Date())
let countdownTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => { countdownTimer = setInterval(() => { now.value = new Date() }, 1000) })
onUnmounted(() => { if (countdownTimer) clearInterval(countdownTimer) })
const countdown = computed(() => { const ms = Math.max(0, weddingDate.getTime() - now.value.getTime()); return { days: Math.floor(ms / 86400000), hours: Math.floor(ms % 86400000 / 3600000), minutes: Math.floor(ms % 3600000 / 60000), seconds: Math.floor(ms % 60000 / 1000) } })
const guestName = ref('')
const email = ref('')
const attendance = ref('oui')
const guests = ref('2')
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
      <nav><a href="#details">La célébration</a><a href="#practical">Informations</a><a href="#reply">Réponse</a></nav>
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
          <div class="schedule"><div><b>16h00</b><span>La cérémonie</span></div><div><b>18h00</b><span>Le cocktail</span></div><div><b>20h30</b><span>Le dîner & la soirée</span></div></div>
          <a class="text-link" href="#practical">Toutes les informations ↗</a>
        </div>
      </div>
    </section>

    <section id="countdown" class="countdown-section"><span class="tag optional">Option personnalisable</span><p class="script">Le grand jour approche</p><h2>Plus que quelques <em>instants…</em></h2><div class="countdown-grid"><div><strong>{{ countdown.days }}</strong><span>JOURS</span></div><div><strong>{{ String(countdown.hours).padStart(2, '0') }}</strong><span>HEURES</span></div><div><strong>{{ String(countdown.minutes).padStart(2, '0') }}</strong><span>MINUTES</span></div><div><strong>{{ String(countdown.seconds).padStart(2, '0') }}</strong><span>SECONDES</span></div></div><p class="countdown-caption">Un décompte animé, ajusté à la date de votre événement.</p></section><section class="quote-band"><span>“</span><p class="script">Le bonheur n'a de sens que lorsqu'il est partagé.</p><small>ÉLISE & ANTOINE</small></section>

    <section id="practical" class="practical section">
      <div class="section-title"><p class="kicker">POUR PRÉPARER VOTRE VENUE</p><p class="script">Quelques détails pratiques</p><h2>Tout simplement <em>l'essentiel</em></h2></div>
      <div class="practical-grid">
        <article><span class="tag included">Inclus</span><div class="card-icon">⌖</div><h3>Le lieu</h3><p>Mas des Oliviers<br>Route des Lavandes, Aix-en-Provence</p><a href="https://www.google.com/maps/search/?api=1&query=Mas+des+Oliviers+Aix-en-Provence" target="_blank" rel="noopener noreferrer">Voir l'itinéraire ↗</a><small>Un lien direct vers le lieu sur Google Maps.</small></article>
        <article><span class="tag included">Inclus</span><div class="card-icon">✉</div><h3>Votre invitation</h3><p>Retrouvez ici les informations essentielles de notre journée et confirmez votre présence.</p><a href="#reply">Répondre à l'invitation ↓</a></article>
        <article><span class="tag optional">Option</span><div class="card-icon">◷</div><h3>Compte à rebours</h3><p>Un joli décompte pour patienter jusqu'au grand jour.</p><small>Animation personnalisée avant l'événement.</small></article>
        <article><span class="tag optional">Option</span><div class="card-icon">▤</div><h3>Programme détaillé</h3><p>Les horaires et les temps forts de votre célébration, présentés en détail.</p><small>Une frise chronologique personnalisée.</small></article>
        <article><span class="tag optional">Option</span><div class="card-icon">⌖</div><h3>Carte interactive</h3><p>Plusieurs lieux réunis sur une même carte : cérémonie, réception, hébergement…</p><small>À distinguer du simple lien d'itinéraire inclus.</small></article>
        <article><span class="tag optional">Option</span><div class="card-icon">♡</div><h3>Réponse des invités</h3><p>Un formulaire RSVP personnalisé pour centraliser les réponses de vos proches.</p><small>Confirmation de présence et informations utiles.</small></article>
      </div>
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
        <label>Nombre de personnes<select v-model="guests"><option value="1">1 personne</option><option value="2">2 personnes</option><option value="3">3 personnes</option><option value="4">4 personnes</option></select></label>
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
.sage-model .celebration{background:#f0f0e8}.sage-model .section-title{text-align:center;margin-bottom:55px}.sage-model .celebration-grid{display:grid;grid-template-columns:1fr 1fr;gap:9%;align-items:center;max-width:1050px;margin:auto}.sage-model .celebration-image{height:470px;background:url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&q=85') center/cover}.sage-model .celebration-text h3{font:400 30px 'Italiana',serif;margin:10px 0}.sage-model .celebration-text>p:not(.script){font-size:13px;line-height:2;color:var(--muted)}.sage-model .schedule{border-top:1px solid #d4d8cc;margin:25px 0}.sage-model .schedule div{display:flex;gap:25px;padding:13px 0;border-bottom:1px solid #d4d8cc;font-size:12px}.sage-model .schedule b{color:var(--sage);font-weight:600}.sage-model .text-link,.sage-model .practical-grid article>a{font-size:11px;color:var(--sage-dark);border-bottom:1px solid #9ca894;padding-bottom:4px}
.sage-model .countdown-section{padding:82px 20px;text-align:center;background:#e8ebe1}.sage-model .countdown-grid{display:flex;justify-content:center;gap:clamp(20px,5vw,60px);margin:30px auto}.sage-model .countdown-grid div{display:flex;flex-direction:column;gap:7px}.sage-model .countdown-grid strong{font:clamp(38px,6vw,62px) 'Italiana',serif;color:var(--sage-dark)}.sage-model .countdown-grid span{font-size:8px;letter-spacing:.18em;color:var(--muted)}.sage-model .countdown-caption,.sage-model .map-intro{font-size:11px;color:var(--muted);line-height:1.9}.sage-model .map-section{background:#f0f0e8}.sage-model .map-frame{max-width:1000px;height:380px;margin:auto;border:8px solid white}.sage-model .map-frame iframe{width:100%;height:100%;border:0}.sage-model .map-links{max-width:1000px;margin:16px auto;display:flex;justify-content:space-between;font-size:10px;color:var(--muted)}.sage-model .map-links a{color:var(--sage-dark);text-decoration:underline}.sage-model .quote-band{background:var(--sage);color:white;text-align:center;padding:75px 20px}.sage-model .quote-band>span{font:60px 'Playfair Display',serif;line-height:.6}.sage-model .quote-band .script{color:white;font-size:27px}.sage-model .quote-band small{font-size:8px;letter-spacing:.2em}
.sage-model .practical{background:var(--paper)}.sage-model .practical-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:1100px;margin:auto}.sage-model .practical-grid article{position:relative;background:#f3f3ed;padding:30px 25px;min-height:270px}.sage-model .tag{display:inline-block;padding:6px 10px;border-radius:20px;font-size:9px;letter-spacing:.08em}.sage-model .tag.included{background:#e0e8dc;color:#50634d}.sage-model .tag.optional{background:#f1e2e2;color:#99656a}.sage-model .card-icon{font:26px 'Italiana',serif;color:var(--sage);margin:20px 0 8px}.sage-model .practical-grid h3{font:24px 'Italiana',serif;margin:0 0 10px}.sage-model .practical-grid p{font-size:11px;line-height:1.8;color:var(--muted);min-height:58px}.sage-model .practical-grid article>a{display:inline-block;margin:7px 0 12px}.sage-model .practical-grid article>small{display:block;color:#898b81;font-size:9px;line-height:1.6}.sage-model .legend{display:flex;justify-content:center;gap:28px;margin:38px 0 0;font-size:10px;color:var(--muted)}.sage-model .legend span{display:flex;align-items:center;gap:8px}.sage-model .dot{width:8px;height:8px;border-radius:50%;display:inline-block}.sage-model .dot.green{background:#81947b}.sage-model .dot.rose{background:var(--rose)}
.sage-model .reply-section{background:var(--cream);padding:95px 20px;text-align:center}.sage-model .reply-intro{font-size:12px;color:var(--muted);margin-bottom:35px}.sage-model form{max-width:490px;margin:auto;text-align:left;display:grid;gap:16px}.sage-model form>label,.sage-model fieldset{display:grid;gap:8px;font-size:10px;letter-spacing:.06em;color:var(--sage-dark)}.sage-model input:not([type=radio]),.sage-model select,.sage-model textarea{width:100%;padding:13px 14px;border:1px solid #d8d9cf;background:#fbfaf6;font:12px 'DM Sans',sans-serif;color:var(--ink);border-radius:0}.sage-model fieldset{border:0;padding:0;margin:0}.sage-model fieldset legend{margin-bottom:10px}.sage-model .choice{display:flex;align-items:center;gap:10px;font-size:11px;color:var(--muted);letter-spacing:0}.sage-model .choice input{accent-color:var(--sage)}.sage-model form button{border:0;background:var(--sage);color:white;padding:15px;letter-spacing:.1em;font:11px 'DM Sans',sans-serif;cursor:pointer}.sage-model form button span{margin-left:8px}.sage-model .demo-note{display:block;margin-top:20px;color:#929388;font-size:9px}.sage-model .success{padding:30px}.sage-model .success h3{font:30px 'Italiana',serif}.sage-model footer{text-align:center;padding:45px 20px;background:#e8ebe1}.sage-model .footer-brand{font-size:35px}.sage-model footer .script{font-size:19px}.sage-model footer small{font-size:8px;letter-spacing:.18em}.sage-model footer a{color:var(--sage);text-decoration:underline;text-underline-offset:3px}
@media(max-width:700px){.sage-model .site-header{height:65px;padding:0 5%}.sage-model nav{gap:13px;font-size:8px}.sage-model .header-date{display:none}.sage-model .cover{grid-template-columns:1fr;padding:55px 7% 75px;gap:35px}.sage-model .cover-art{height:350px}.sage-model .arch-photo{width:78%}.sage-model .cover-bottom{left:7%;right:7%;font-size:7px}.sage-model .section{padding:75px 7%}.sage-model .celebration-grid{grid-template-columns:1fr;gap:30px}.sage-model .celebration-image{height:330px}.sage-model .practical-grid{grid-template-columns:1fr 1fr}.sage-model .practical-grid article{padding:22px 17px;min-height:260px}.sage-model .legend{flex-wrap:wrap;gap:12px}.sage-model .quote-band .script{font-size:22px}}
@media(max-width:420px){.sage-model nav{gap:9px}.sage-model nav a{font-size:7px}.sage-model .practical-grid{grid-template-columns:1fr}.sage-model .practical-grid article{min-height:0}.sage-model .practical-grid p{min-height:0}.sage-model .cover-art{height:300px}}
</style>
