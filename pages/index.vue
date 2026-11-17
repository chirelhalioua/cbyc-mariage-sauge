<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const weddingDate = new Date('2027-09-18T16:00:00')
const now = ref(new Date())
let countdownTimer: ReturnType<typeof setInterval> | undefined
let revealObserver: IntersectionObserver | undefined
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  loadGuestbook()
  handleScroll()
  countdownTimer = setInterval(() => { now.value = new Date() }, 1000)
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        revealObserver?.unobserve(entry.target)
      }
    })
  }, { threshold: 0.14 })
  document.querySelectorAll('.sage-model > section:not(.cover)').forEach((section) => {
    section.classList.add('reveal-on-scroll')
    revealObserver?.observe(section)
  })
  // Déclencher les animations internes uniquement lorsque chaque élément entre à l'écran
  document.querySelectorAll(
    '.sage-model .guestbook-section .section-title, .sage-model .guestbook-form, .sage-model .guestbook-message, .sage-model .guestbook-empty, .sage-model .reply-section > *'
  ).forEach((element) => {
    element.classList.add('reveal-on-scroll')
    revealObserver?.observe(element)
  })
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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
const replyError = ref('')
const guestbookName = ref('')
const guestbookMessage = ref('')
const guestbookSent = ref(false)
const guestbookError = ref('')
const guestbookMessages = ref<Array<{ name: string; message: string; createdAt: string }>>([])
const guestbookLoading = ref(false)

async function loadGuestbook() {
  guestbookLoading.value = true
  try {
    const result = await $fetch<{ messages: Array<{ name: string; message: string; createdAt: string }> }>('/api/guestbook')
    guestbookMessages.value = result.messages
  } catch {
    guestbookError.value = 'Le livre d’or sera bientôt disponible.'
  } finally {
    guestbookLoading.value = false
  }
}

async function sendGuestbookMessage() {
  guestbookError.value = ''
  try {
    await $fetch('/api/guestbook', {
      method: 'POST',
      body: { name: guestbookName.value, message: guestbookMessage.value }
    })
    guestbookSent.value = true
    guestbookName.value = ''
    guestbookMessage.value = ''
  } catch (error: any) {
    guestbookError.value = error?.data?.statusMessage || 'Impossible d’envoyer votre message pour le moment.'
  }
}
const mobileMenuOpen = ref(false)
const dressPalette = [
  { name: 'Vert sauge', hex: '#87947d' },
  { name: 'Crème', hex: '#eee9dc' },
  { name: 'Beige', hex: '#c9b99f' },
  { name: 'Olive', hex: '#626b4d' },
  { name: 'Terracotta doux', hex: '#b77e68' }
]

const selectedDressGender = ref<'all' | 'women' | 'men'>('all')
const selectedDressColor = ref('all')
function setDressGender(value: 'all' | 'women' | 'men') {
  selectedDressGender.value = value
}
function setDressColor(value: string) {
  selectedDressColor.value = selectedDressColor.value === value ? 'all' : value
}
const dressOutfits = [
  { gender: 'women', colors: ['Vert sauge'], image: 'https://robe-avenue.com/cdn/shop/files/robe-invitee-de-mariage-vert-sauge-robe-invitee-mariage-vert-sauge-robe-avenue-1155677696.webp?v=1744522071&width=800', alt: 'Robe longue vert sauge pour une invitée', title: 'Vert sauge', description: 'Robe fluide ou satinée' },
  { gender: 'women', colors: ['Olive', 'Terracotta doux'], image: 'https://klodsy.com/images/blog/es/clutch-rafia-invitada-boda.webp', alt: 'Tenue d’invitée dans des tons olive et terracotta', title: 'Olive & terracotta', description: 'Robe ou ensemble coloré' },
  { gender: 'men', colors: ['Vert sauge'], image: 'https://sweettailor.fr/cdn/shop/files/costume-vert-sauge-col-mao.png?v=1762401209&width=1445', alt: 'Costume trois pièces vert sauge pour homme', title: 'Vert sauge', description: 'Costume vert sauge et accessoires clairs' },
  { gender: 'men', colors: ['Olive'], image: 'https://content.moss.co.uk/images/extraextralarge/967015112_01.jpg', alt: 'Costume trois pièces vert olive foncé pour homme', title: 'Vert olive foncé', description: 'Costume trois pièces vert foncé' }
]
const filteredDressOutfits = computed(() => dressOutfits.filter((outfit) => {
  const genderMatches = selectedDressGender.value === 'all' || outfit.gender === selectedDressGender.value
  const colorMatches = selectedDressColor.value === 'all' || outfit.colors.includes(selectedDressColor.value)
  return genderMatches && colorMatches
}))
const showBackToTop = ref(false)
function handleScroll() { showBackToTop.value = window.scrollY > 320 }

async function sendReply() {
  replyError.value = ''
  try {
    await $fetch('/api/rsvp', {
      method: 'POST',
      body: { name: guestName.value, email: email.value, attendance: attendance.value, guests: guests.value, note: note.value }
    })
    sent.value = true
  } catch (error: any) {
    replyError.value = error?.data?.statusMessage || 'Votre réponse n’a pas pu être enregistrée. Réessayez.'
  }
}
</script>

<template>
  <main class="sage-model">
    <header class="site-header">
      <a class="brand" href="#top" @click="mobileMenuOpen = false"><img src="/images/Monogramme%20de%20mariage%20%C3%89lise%20%26%20Antoine.png" alt="Élise & Antoine"></a>
      <button class="menu-toggle" type="button" :aria-expanded="mobileMenuOpen" aria-label="Ouvrir le menu" @click="mobileMenuOpen = !mobileMenuOpen">
        <span :class="{ active: mobileMenuOpen }"></span><span :class="{ active: mobileMenuOpen }"></span>
      </button>
      <nav :class="{ 'menu-open': mobileMenuOpen }">
        <a href="#top" @click="mobileMenuOpen = false">Accueil</a>
        <a href="#details" @click="mobileMenuOpen = false">La célébration</a>
        <a href="#programme" @click="mobileMenuOpen = false">Programme</a>
        <a href="#practical" @click="mobileMenuOpen = false">Infos pratiques</a>
        <a href="#guestbook" @click="mobileMenuOpen = false">Livre d’or</a>
        <a href="#map" @click="mobileMenuOpen = false">Carte</a>
        <a href="#reply" @click="mobileMenuOpen = false">Réponse</a>
      </nav>
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
        <div class="cover-stamp"><img src="/images/Monogramme%20de%20mariage%20%C3%89lise%20%26%20Antoine.png" alt="Monogramme Élise & Antoine"></div>
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
      <a class="section-scroll" href="#dress-code" aria-label="Défiler vers le dress code"><span aria-hidden="true">↓</span></a>
    </section>
    <section id="dress-code" class="details-feature section">
      <div class="section-title"><span class="tag optional">Option personnalisable</span><p class="kicker">LE PETIT CONSEIL DES MARIÉS</p><p class="script">Une harmonie tout en douceur</p><h2>Le <em>dress code</em></h2><p class="feature-intro">Pour cette journée en Provence, nous vous proposons une palette naturelle et lumineuse. Faites-vous plaisir en choisissant une tenue dans ces tonalités.</p></div>
      <div class="dress-filters" aria-label="Filtrer les inspirations">
        <div class="gender-filters" aria-label="Choisir les tenues">
          <button type="button" :class="{ active: selectedDressGender === 'all' }" @click="setDressGender('all')">Tout</button>
          <button type="button" :class="{ active: selectedDressGender === 'women' }" @click="setDressGender('women')">Femme</button>
          <button type="button" :class="{ active: selectedDressGender === 'men' }" @click="setDressGender('men')">Homme</button>
        </div>
        <p class="color-filter-label">Choisir une couleur</p>
        <div class="palette-row">
          <button v-for="color in dressPalette" :key="color.hex" type="button" class="palette-color" :class="{ selected: selectedDressColor === color.name }" :aria-pressed="selectedDressColor === color.name" @click="setDressColor(color.name)">
            <span :style="{ backgroundColor: color.hex }"></span><small>{{ color.name }}</small>
          </button>
          <button type="button" class="color-reset" :class="{ selected: selectedDressColor === 'all' }" @click="setDressColor('all')">Toutes</button>
        </div>
      </div>
      <div class="inspiration-grid">
        <figure v-for="outfit in filteredDressOutfits" :key="outfit.title" class="outfit-card">
          <img :src="outfit.image" :alt="outfit.alt" loading="lazy">
          <figcaption><strong>{{ outfit.gender === 'women' ? 'Pour elles' : 'Pour eux' }} · {{ outfit.title }}</strong><br>{{ outfit.description }}</figcaption>
        </figure>
        <p v-if="filteredDressOutfits.length === 0" class="no-outfits">Pas d’inspiration pour cette couleur pour le moment.</p>
      </div>
      <p class="feature-note">Exemple de dress code — les couleurs, les inspirations et les consignes seront entièrement adaptées aux souhaits de chaque couple. Merci d'éviter le blanc réservé aux mariés.</p>
    </section>
    <section id="accommodations" class="details-feature accommodations-section section">
      <div class="section-title"><span class="tag optional">Option personnalisable</span><p class="kicker">TOUT POUR ORGANISER VOTRE VENUE</p><p class="script">Nous avons pensé aux petits détails</p><h2>Hébergements <em>& transports</em></h2><p class="feature-intro">Retrouvez ici les informations utiles pour préparer votre déplacement et profiter pleinement de la journée.</p></div>
      <div class="travel-grid">
        <article class="travel-card"><span>01 · DORMIR</span><div class="travel-icon">⌂</div><h3>Hébergements</h3><p>Les adresses d'hôtels et de chambres d'hôtes recommandés par les mariés seront ajoutées ici.</p><small>Adresses et éventuels tarifs à compléter par les mariés.</small><a href="https://www.google.com/maps/search/hotels+Aix-en-Provence" target="_blank" rel="noopener noreferrer">Voir les hôtels à proximité ↗</a></article>
        <article class="travel-card"><span>02 · SE GARER</span><div class="travel-icon">⌖</div><h3>Parkings</h3><p>Les informations concernant le stationnement et les éventuelles zones de dépose seront précisées ici.</p><small>Parking conseillé et conditions à confirmer.</small><a href="https://www.google.com/maps/search/parking+Aix-en-Provence" target="_blank" rel="noopener noreferrer">Rechercher un parking ↗</a></article>
        <article class="travel-card"><span>03 · SE DÉPLACER</span><div class="travel-icon">↗</div><h3>Transports & navettes</h3><p>Les horaires de navette, les points de rendez-vous et les options de transport seront indiqués ici.</p><small>Horaires et réservations à compléter.</small><a href="https://www.google.com/maps/dir/?api=1&destination=Aix-en-Provence" target="_blank" rel="noopener noreferrer">Préparer son itinéraire ↗</a></article>
      </div>
      <p class="feature-note">Informations d'exemple pour la maquette — aucun hôtel, parking ou service de navette n'est confirmé à ce stade.</p>
    </section>
    <section id="guestbook" class="guestbook-section section">
      <div class="section-title"><span class="tag optional">Option personnalisable</span><p class="kicker">UN SOUVENIR À PARTAGER</p><p class="script">Quelques mots qui resteront</p><h2>Le livre <em>d’or</em></h2><p class="map-intro">Laissez un petit mot aux mariés. Chaque message sera publié après leur validation.</p></div>
      <form v-if="!guestbookSent" class="guestbook-form" @submit.prevent="sendGuestbookMessage">
        <label>Votre prénom et nom<input v-model="guestbookName" required minlength="2" maxlength="80" placeholder="Votre nom"></label>
        <label>Votre petit mot<textarea v-model="guestbookMessage" required minlength="3" maxlength="1000" rows="4" placeholder="Un vœu, un souvenir, une pensée…"></textarea></label>
        <button type="submit">Déposer mon message <span>♡</span></button>
        <p v-if="guestbookError" class="form-error">{{ guestbookError }}</p>
      </form>
      <div v-else class="success"><h3>Merci pour votre mot !</h3><p>Il sera visible ici dès que les mariés l’auront validé.</p></div>
      <p v-if="guestbookLoading" class="guestbook-empty">Chargement des messages…</p>
      <div v-else-if="guestbookMessages.length" class="guestbook-messages">
        <article v-for="(message, index) in guestbookMessages" :key="index" class="guestbook-message">
          <span>“</span><p>{{ message.message }}</p><small>{{ message.name }}</small>
        </article>
      </div>
      <p v-else class="guestbook-empty">Les premiers petits mots apparaîtront ici après validation.</p>
    </section>
    <section id="map" class="map-section section"><div class="section-title"><span class="tag optional">Option personnalisable</span><p class="kicker">TOUS LES CHEMINS MÈNENT À NOUS</p><p class="script">Retrouvez-nous facilement</p><h2>La carte de <em>notre journée</em></h2><p class="map-intro">Une carte interactive personnalisée peut réunir tous les lieux utiles à vos invités : cérémonie, réception, hébergement et stationnement.</p></div><div class="map-frame"><iframe title="Carte du secteur d'Aix-en-Provence" src="https://www.google.com/maps?q=Aix-en-Provence&output=embed" loading="lazy"></iframe></div><div class="map-links"><a href="https://www.google.com/maps/search/?api=1&query=Mas+des+Oliviers+Aix-en-Provence" target="_blank" rel="noopener noreferrer">Itinéraire vers le lieu ↗</a><span>Exemple de carte — les adresses seront personnalisées pour chaque événement.</span></div></section>
    <section id="reply" class="reply-section">
      <span class="tag optional">Option personnalisable</span>
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
      <p v-if="replyError" class="form-error">{{ replyError }}</p>
      <div v-if="sent" class="success"><h3>Merci {{ guestName }} !</h3><p>Votre réponse a bien été enregistrée.</p></div>
      <small class="demo-note">Vos réponses sont enregistrées de manière sécurisée pour les mariés.</small>
    </section>
    <a v-if="showBackToTop" class="back-to-top" href="#top" aria-label="Remonter en haut du site" title="Retour en haut">↑</a>
    <footer><div class="footer-brand"><img src="/images/Monogramme%20de%20mariage%20%C3%89lise%20%26%20Antoine.png" alt="Monogramme Élise & Antoine"></div><p class="script">À très bientôt pour célébrer l'amour</p><small>INVITATION IMAGINÉE AVEC <a href="https://www.cbyc-invitations.fr/" target="_blank" rel="noopener noreferrer">C BY C</a></small></footer>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Italiana&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
.sage-model{--sage:#687764;--sage-dark:#465342;--cream:#f5f2e9;--paper:#fbfaf6;--ink:#34392f;--muted:#77796f;--rose:#b77c82;background:var(--paper);color:var(--ink);font-family:'DM Sans',sans-serif;font-weight:300}
.sage-model *{box-sizing:border-box}.sage-model a{color:inherit;text-decoration:none}.sage-model .site-header{height:78px;padding:0 7%;display:flex;align-items:center;justify-content:space-between;background:var(--paper);letter-spacing:.12em;font-size:10px}.sage-model .brand,.sage-model .footer-brand{font-family:'Italiana',serif;font-size:27px;letter-spacing:0}.sage-model .brand{display:flex;align-items:center;width:48px;height:48px;border-radius:50%;overflow:hidden}.sage-model .brand img{width:100%;height:100%;object-fit:cover;border-radius:50%}.sage-model .footer-brand{width:92px;height:92px;margin:0 auto 12px;border-radius:50%;overflow:hidden}.sage-model .footer-brand img{width:100%;height:100%;object-fit:cover;border-radius:50%}.sage-model .brand span,.sage-model .footer-brand span{color:var(--rose)}.sage-model nav{display:flex;gap:34px}.sage-model nav a,.sage-model .header-date{transition:color .2s}.sage-model nav a:hover,.sage-model .header-date:hover{color:var(--sage)}
.sage-model .cover{min-height:660px;background:var(--cream);position:relative;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:65px 10% 95px;overflow:hidden}.sage-model .cover-copy{text-align:center;z-index:1}.sage-model .kicker{font-size:9px;letter-spacing:.24em;color:var(--sage);font-weight:600}.sage-model .script{font-family:'Playfair Display',serif;font-style:italic;color:var(--sage);font-size:22px}.sage-model h1{font:400 clamp(64px,8vw,112px)/.95 'Italiana',serif;letter-spacing:-.04em;margin:20px 0}.sage-model h1 i{font:italic 400 .65em 'Playfair Display',serif;color:var(--sage)}.sage-model .fine-line{display:flex;align-items:center;justify-content:center;gap:12px;color:var(--sage);margin:24px auto}.sage-model .fine-line span{height:1px;width:52px;background:#aeb5a4}.sage-model .wedding-logo{display:block;width:min(100%,390px);height:auto;margin:10px auto 18px;filter:drop-shadow(0 8px 18px rgba(52,57,47,.06))}.sage-model .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.sage-model .date-line{font-size:9px;letter-spacing:.18em}.sage-model .date-line b{color:var(--rose);padding:0 7px}.sage-model .pill-link{display:inline-flex;gap:24px;align-items:center;margin-top:35px;padding:14px 22px;border:1px solid #aab09f;border-radius:30px;font-size:10px;letter-spacing:.08em}.sage-model .pill-link span{font-size:16px}.sage-model .cover-art{height:470px;position:relative;display:flex;justify-content:center;align-items:center}.sage-model .arch-photo{width:76%;height:100%;border-radius:48% 48% 0 0;background:linear-gradient(0deg,#41483b22,#41483b11),url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&q=85') center/cover;box-shadow:18px 18px 0 #dce0d3}.sage-model .cover-stamp{position:absolute;left:2%;bottom:13%;width:112px;height:112px;border-radius:50%;overflow:hidden;background:#fbfaf6;display:grid;place-items:center;box-shadow:0 6px 24px #34392f18;border:1px solid #e6e1d3}.sage-model .cover-stamp img{width:100%;height:100%;object-fit:cover;border-radius:50%}.sage-model .cover-stamp small{font:italic 13px 'Playfair Display',serif}.sage-model .photo-note{position:absolute;right:-2%;bottom:4%;font-size:8px;letter-spacing:.2em;writing-mode:vertical-rl}.sage-model .cover-bottom{position:absolute;bottom:25px;left:10%;right:10%;display:flex;justify-content:space-between;font-size:8px;letter-spacing:.2em;color:var(--muted)}
.sage-model .section{padding:100px 10%}.sage-model .welcome{text-align:center;max-width:850px;margin:auto}.sage-model h2{font:400 clamp(38px,5vw,58px)/1.08 'Italiana',serif;margin:14px 0 22px}.sage-model h2 em{font-family:'Playfair Display',serif;color:var(--sage);font-weight:400}.sage-model .body-copy{max-width:560px;margin:0 auto;color:var(--muted);font-size:13px;line-height:2}.sage-model .olive-branch{font-size:42px;color:#a0aa95;margin-top:25px}
.sage-model .celebration{background:#f0f0e8}.sage-model .section-title{text-align:center;margin-bottom:55px}.sage-model .celebration-grid{display:grid;grid-template-columns:1fr 1fr;gap:9%;align-items:center;max-width:1050px;margin:auto}.sage-model .celebration-image{height:470px;position:relative;background:linear-gradient(180deg,#34392f08,#34392f20),url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=90') center/cover;border:8px solid #fbfaf6;border-radius:48% 48% 5px 5px;box-shadow:14px 14px 0 #dce0d3;isolation:isolate}.sage-model .celebration-image:after{content:'';position:absolute;inset:8px;border:1px solid #ffffffa6;border-radius:inherit;pointer-events:none}.sage-model .celebration-text h3{font:400 30px 'Italiana',serif;margin:10px 0}.sage-model .celebration-text>p:not(.script){font-size:13px;line-height:2;color:var(--muted)}.sage-model .text-link,.sage-model .practical-grid article>a{font-size:11px;color:var(--sage-dark);border-bottom:1px solid #9ca894;padding-bottom:4px}
.sage-model .programme-section{background:var(--paper)}.sage-model .programme-intro{max-width:560px;margin:0 auto;color:var(--muted);font-size:12px;line-height:1.9}.sage-model .timeline{max-width:820px;margin:0 auto;position:relative}.sage-model .timeline:before{content:"";position:absolute;left:145px;top:12px;bottom:20px;width:1px;background:#cbd2c4}.sage-model .timeline-item{display:grid;grid-template-columns:110px 70px 1fr;gap:0;position:relative;padding:0 0 38px}.sage-model .timeline-time{text-align:right;padding:7px 22px 0 0;color:var(--sage-dark);font:25px 'Italiana',serif}.sage-model .timeline-marker{z-index:1;width:28px;height:28px;border-radius:50%;background:#e8ebe1;border:1px solid #b9c3b2;color:var(--sage);display:grid;place-items:center;margin:4px auto;font-size:13px}.sage-model .timeline-content{padding:4px 0 0 18px}.sage-model .timeline-content>span{font-size:8px;letter-spacing:.18em;color:var(--sage);font-weight:600}.sage-model .timeline-content h3{font:27px 'Italiana',serif;margin:7px 0}.sage-model .timeline-content p{font-size:11px;line-height:1.9;color:var(--muted);margin:0;max-width:480px}.sage-model .timeline-note{text-align:center;color:#929388;font-size:9px;margin-top:12px}.sage-model .countdown-section{padding:82px 20px;text-align:center;background:#e8ebe1}.sage-model .countdown-grid{display:flex;justify-content:center;gap:clamp(20px,5vw,60px);margin:30px auto}.sage-model .countdown-grid div{display:flex;flex-direction:column;gap:7px}.sage-model .countdown-grid strong{font:clamp(38px,6vw,62px) 'Italiana',serif;color:var(--sage-dark)}.sage-model .countdown-grid span{font-size:8px;letter-spacing:.18em;color:var(--muted)}.sage-model .countdown-caption,.sage-model .map-intro{font-size:11px;color:var(--muted);line-height:1.9}.sage-model .map-section{background:#f0f0e8}.sage-model .map-frame{max-width:1000px;height:380px;margin:auto;border:8px solid white}.sage-model .map-frame iframe{width:100%;height:100%;border:0}.sage-model .map-links{max-width:1000px;margin:16px auto;display:flex;justify-content:space-between;font-size:10px;color:var(--muted)}.sage-model .map-links a{color:var(--sage-dark);text-decoration:underline}.sage-model .quote-band{background:var(--sage);color:white;text-align:center;padding:75px 20px}.sage-model .quote-band>span{font:60px 'Playfair Display',serif;line-height:.6}.sage-model .quote-band .script{color:white;font-size:27px}.sage-model .quote-band small{font-size:8px;letter-spacing:.2em}
.sage-model .practical{background:var(--paper)}.sage-model .practical-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:1100px;margin:auto}.sage-model .practical-grid article{position:relative;background:transparent;padding:30px 25px;min-height:0}.sage-model .tag{display:inline-block;padding:6px 10px;border-radius:20px;font-size:9px;letter-spacing:.08em}.sage-model .tag.included{background:#e0e8dc;color:#50634d}.sage-model .tag.optional{background:#f1e2e2;color:#99656a}.sage-model .card-icon{font:26px 'Italiana',serif;color:var(--sage);margin:20px 0 8px}.sage-model .practical-grid h3{font:24px 'Italiana',serif;margin:0 0 10px}.sage-model .practical-grid p{font-size:11px;line-height:1.8;color:var(--muted);min-height:58px}.sage-model .practical-grid article>a{display:inline-block;margin:7px 0 12px}.sage-model .practical-grid article>small{display:block;color:#898b81;font-size:9px;line-height:1.6}.sage-model .legend{display:flex;justify-content:center;gap:28px;margin:38px 0 0;font-size:10px;color:var(--muted)}.sage-model .legend span{display:flex;align-items:center;gap:8px}.sage-model .dot{width:8px;height:8px;border-radius:50%;display:inline-block}.sage-model .dot.green{background:#81947b}.sage-model .dot.rose{background:var(--rose)}
.sage-model .reply-section{background:var(--cream);padding:95px 20px;text-align:center}.sage-model .reply-intro{font-size:12px;color:var(--muted);margin-bottom:35px}.sage-model form{max-width:490px;margin:auto;text-align:left;display:grid;gap:16px}.sage-model form>label,.sage-model fieldset{display:grid;gap:8px;font-size:10px;letter-spacing:.06em;color:var(--sage-dark)}.sage-model input:not([type=radio]),.sage-model select,.sage-model textarea{width:100%;padding:13px 14px;border:1px solid #d8d9cf;background:#fbfaf6;font:12px 'DM Sans',sans-serif;color:var(--ink);border-radius:0}.sage-model fieldset{border:0;padding:0;margin:0}.sage-model fieldset legend{margin-bottom:10px}.sage-model .choice{display:flex;align-items:center;gap:10px;font-size:11px;color:var(--muted);letter-spacing:0}.sage-model .choice input{accent-color:var(--sage)}.sage-model form button{border:0;background:var(--sage);color:white;padding:15px;letter-spacing:.1em;font:11px 'DM Sans',sans-serif;cursor:pointer}.sage-model form button span{margin-left:8px}.sage-model .demo-note{display:block;margin-top:20px;color:#929388;font-size:9px}.sage-model .success{padding:30px}.sage-model .success h3{font:30px 'Italiana',serif}.sage-model footer{text-align:center;padding:45px 20px;background:#e8ebe1}.sage-model .footer-brand{font-size:35px}.sage-model footer .script{font-size:19px}.sage-model footer small{font-size:8px;letter-spacing:.18em}.sage-model footer a{color:var(--sage);text-decoration:underline;text-underline-offset:3px}
@media(max-width:700px){.sage-model .brand{width:43px;height:43px}.sage-model .footer-brand{width:82px;height:82px}.sage-model .cover-stamp{width:96px;height:96px}.sage-model .site-header{height:68px;padding:0 6%;position:relative;z-index:20}.sage-model .menu-toggle{display:flex;width:42px;height:42px;border:1px solid #d8ded2;border-radius:50%;background:#f3f4ee;align-items:center;justify-content:center;flex-direction:column;gap:6px;cursor:pointer}.sage-model .menu-toggle span{display:block;width:16px;height:1.5px;background:var(--sage-dark);transition:transform .25s ease}.sage-model .menu-toggle span:first-child.active{transform:translateY(3.75px) rotate(45deg)}.sage-model .menu-toggle span:last-child.active{transform:translateY(-3.75px) rotate(-45deg)}.sage-model nav{position:absolute;top:calc(100% + 8px);left:5%;right:5%;display:flex;flex-direction:column;gap:0;padding:10px 18px;background:#fbfaf6;border:1px solid #e3e6dd;box-shadow:0 18px 40px #34392f18;opacity:0;visibility:hidden;transform:translateY(-8px);transition:opacity .25s ease,transform .25s ease,visibility .25s}.sage-model nav.menu-open{opacity:1;visibility:visible;transform:translateY(0)}.sage-model nav a{padding:15px 4px;border-bottom:1px solid #e9ebe4;font-size:10px;letter-spacing:.15em;color:var(--sage-dark)}.sage-model nav a:last-child{border-bottom:0}.sage-model .header-date{display:none}.sage-model .cover{grid-template-columns:1fr;padding:55px 7% 75px;gap:35px}.sage-model .wedding-logo{width:min(82vw,340px);margin:8px auto 14px}.sage-model .cover-art{height:350px}.sage-model .arch-photo{width:78%}.sage-model .cover-bottom{left:7%;right:7%;font-size:7px}.sage-model .section{padding:75px 7%}.sage-model .celebration-grid{grid-template-columns:1fr;gap:30px}.sage-model .celebration-image{height:390px;max-width:100%;margin:0 7px 8px}.sage-model .practical-grid{grid-template-columns:1fr 1fr}.sage-model .practical-grid article{padding:22px 17px;min-height:260px}.sage-model .legend{flex-wrap:wrap;gap:12px}.sage-model .quote-band .script{font-size:22px}}
@media(max-width:700px){.sage-model .timeline:before{left:91px}.sage-model .timeline-item{grid-template-columns:70px 42px 1fr}.sage-model .timeline-time{font-size:21px;padding-right:12px}.sage-model .timeline-content{padding-left:12px}.sage-model .timeline-content h3{font-size:23px}}
@media(max-width:420px){.sage-model nav{gap:9px}.sage-model nav a{font-size:7px}.sage-model .practical-grid{grid-template-columns:1fr}.sage-model .practical-grid article{min-height:0}.sage-model .practical-grid p{min-height:0}.sage-model .cover-art{height:300px}}

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
/* Sécurité : les étapes restent visibles même si l'observateur d'animation ne se déclenche pas */
.sage-model .timeline-item{opacity:1;transform:none;transition:transform .3s ease}
.sage-model .timeline-item:hover{transform:translateX(5px)}
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

.sage-model .menu-toggle{display:none}.sage-model nav a{position:relative;padding:8px 0}.sage-model nav a:after{content:"";position:absolute;left:0;right:100%;bottom:0;height:1px;background:var(--sage);transition:right .25s ease}.sage-model nav a:hover:after{right:0}

@media(max-width:700px){
  .sage-model .menu-toggle{display:flex!important;flex-shrink:0;position:relative;z-index:22}
  .sage-model .site-header{justify-content:space-between}
  .sage-model .site-header nav{z-index:21}
}

.sage-model{scroll-behavior:smooth}
.sage-model .back-to-top{position:fixed;right:22px;bottom:24px;z-index:30;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:var(--sage);color:#fff;border:1px solid #82917c;box-shadow:0 7px 22px #34392f30;font:26px/1 'DM Sans',sans-serif;text-decoration:none;transition:transform .25s ease,background .25s ease,box-shadow .25s ease}
.sage-model .back-to-top:hover{background:var(--sage-dark);transform:translateY(-5px);box-shadow:0 11px 26px #34392f35}
@media(max-width:700px){.sage-model .back-to-top{right:16px;bottom:18px;width:44px;height:44px;font-size:24px}}
@media(prefers-reduced-motion:reduce){.sage-model{scroll-behavior:auto}}

.sage-model .attention-heading{text-align:center;max-width:620px;margin:68px auto 38px}
.sage-model .attention-heading h3{font:400 38px 'Italiana',serif;margin:12px 0}
.sage-model .attention-heading h3 em{font-family:'Playfair Display',serif;color:var(--sage);font-weight:400}
.sage-model .attention-heading>p:last-child{font-size:12px;line-height:1.9;color:var(--muted);max-width:500px;margin:0 auto}
.sage-model .attention-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;max-width:1100px;margin:0 auto}
.sage-model .attention-card{padding:28px 24px 30px;background:#f1f2eb;border:1px solid #e8ebe2;min-height:300px;transition:transform .3s ease,box-shadow .3s ease}
.sage-model .attention-card:hover{transform:translateY(-6px);box-shadow:0 14px 30px #34392f12}
.sage-model .attention-card-link{display:flex;flex-direction:column;align-items:flex-start;text-decoration:none;color:inherit}
.sage-model .attention-card-link .attention-link{margin-top:auto}
.sage-model .attention-icon{font:34px 'Italiana',serif;color:var(--sage);margin:25px 0 16px}
.sage-model .attention-number{font-size:8px!important;letter-spacing:.18em;color:var(--sage)!important;font-weight:600}
.sage-model .attention-card h3{font:26px 'Italiana',serif;margin:8px 0 12px}
.sage-model .attention-card>p:not(.attention-number){font-size:11px;line-height:1.9;color:var(--muted);min-height:82px}
.sage-model .attention-link{display:inline-block;margin-top:12px;padding-bottom:5px;border-bottom:1px solid #b7c0b0;color:var(--sage-dark);font:italic 12px 'Playfair Display',serif}
@media(max-width:700px){.sage-model .attention-grid{grid-template-columns:1fr;gap:14px}.sage-model .attention-card{min-height:0;padding:25px 22px}.sage-model .attention-card>p:not(.attention-number){min-height:0}.sage-model .attention-heading{margin:55px auto 30px}}

.sage-model .details-feature{background:#fbfaf6}
.sage-model .accommodations-section{background:#f0f0e8}
.sage-model .feature-intro{max-width:600px;margin:0 auto;color:var(--muted);font-size:12px;line-height:1.9}
.sage-model .palette-row{display:flex;justify-content:center;gap:24px;flex-wrap:wrap;margin:42px auto}
.sage-model .palette-color{display:grid;gap:9px;justify-items:center;font-size:9px;color:var(--muted)}
.sage-model .palette-color span{width:66px;height:66px;border-radius:50%;border:4px solid white;box-shadow:0 2px 12px #34392f18}
.sage-model .inspiration-grid{max-width:1000px;margin:35px auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.sage-model .inspiration-grid figure{margin:0}
.sage-model .dress-filters{max-width:760px;margin:34px auto 20px;text-align:center}
.sage-model .gender-filters{display:flex;justify-content:center;gap:8px;flex-wrap:wrap}
.sage-model .gender-filters button,.sage-model .color-reset{border:1px solid #cbd2c4;background:transparent;color:var(--sage-dark);border-radius:24px;padding:10px 20px;font:10px 'DM Sans',sans-serif;letter-spacing:.08em;cursor:pointer;transition:all .2s ease}
.sage-model .gender-filters button.active,.sage-model .color-reset.selected{background:var(--sage);border-color:var(--sage);color:white}
.sage-model .color-filter-label{margin:22px 0 0;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.sage-model .dress-filters .palette-row{margin:16px auto 0;gap:15px}
.sage-model .dress-filters .palette-color{border:0;background:transparent;padding:5px 7px;border-radius:10px;cursor:pointer}
.sage-model .dress-filters .palette-color.selected{background:#e8ebe1;outline:1px solid #aab5a2}
.sage-model .dress-filters .palette-color span{width:42px;height:42px}
.sage-model .color-reset{align-self:center;padding:9px 14px}
.sage-model .outfit-card{animation:outfitFadeIn .3s ease both}
.sage-model .no-outfits{grid-column:1/-1;text-align:center;color:var(--muted);font-size:12px;padding:28px}
@keyframes outfitFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

.sage-model .inspiration-grid img{width:100%;height:310px;object-fit:cover;display:block}
.sage-model .inspiration-grid figcaption{text-align:center;padding:12px 5px;color:var(--sage-dark);font:italic 13px 'Playfair Display',serif}
.sage-model .feature-note{text-align:center;max-width:760px;margin:28px auto 0;color:#929388;font-size:9px;line-height:1.8}
.sage-model .travel-grid{max-width:1050px;margin:0 auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.sage-model .travel-card{padding:28px 24px;background:#fbfaf6;border:1px solid #e5e8df;display:flex;flex-direction:column;align-items:flex-start;min-height:300px}
.sage-model .travel-card>span{font-size:8px;letter-spacing:.18em;color:var(--sage);font-weight:600}
.sage-model .travel-icon{font:32px 'Italiana',serif;color:var(--sage);margin:20px 0 8px}
.sage-model .travel-card h3{font:25px 'Italiana',serif;margin:0 0 10px}
.sage-model .travel-card p{font-size:11px;line-height:1.8;color:var(--muted);margin:0 0 12px}
.sage-model .travel-card small{font-size:9px;line-height:1.6;color:#929388;margin-top:auto}
.sage-model .travel-card a{font-size:10px;color:var(--sage-dark);border-bottom:1px solid #b7c0b0;padding-bottom:4px;margin-top:16px}
.sage-model .guestbook-section{background:#f0f0e8}
.sage-model .guestbook-form{max-width:560px;margin:0 auto;display:grid;gap:15px}
.sage-model .guestbook-form label{display:grid;gap:8px;font-size:10px;letter-spacing:.06em;color:var(--sage-dark)}
.sage-model .guestbook-form input,.sage-model .guestbook-form textarea{width:100%;padding:14px;border:1px solid #d8d9cf;background:#fbfaf6;font:12px 'DM Sans',sans-serif;color:var(--ink)}
.sage-model .guestbook-form button{border:0;background:var(--sage);color:white;padding:15px;letter-spacing:.1em;font:11px 'DM Sans',sans-serif;cursor:pointer}
.sage-model .guestbook-messages{max-width:900px;margin:38px auto 0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.sage-model .guestbook-message{background:#fbfaf6;padding:25px;border:1px solid #e5e8df;text-align:center}
.sage-model .guestbook-message>span{font:40px 'Playfair Display',serif;color:var(--sage)}
.sage-model .guestbook-message p{font:italic 15px/1.8 'Playfair Display',serif;color:var(--ink)}
.sage-model .guestbook-message small{font-size:9px;letter-spacing:.15em;color:var(--sage)}
.sage-model .guestbook-empty{text-align:center;color:var(--muted);font-size:11px;margin:28px auto}
.sage-model .form-error{color:#a34f55;font-size:11px;text-align:center}
@media(max-width:700px){.sage-model .guestbook-messages{grid-template-columns:1fr}.sage-model .inspiration-grid{grid-template-columns:1fr 1fr}.sage-model .inspiration-grid img{height:230px}.sage-model .travel-grid{grid-template-columns:1fr}.sage-model .travel-card{min-height:0}.sage-model .palette-color span{width:52px;height:52px}}


/* Transition vers les informations pratiques */
.sage-model .practical{padding-bottom:12px}
.sage-model .practical .section-title{margin-bottom:0}
.sage-model .section-scroll{width:44px;height:44px;margin:22px auto 0;border:1px solid #aab5a2;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--sage);font-size:25px;line-height:1;transition:background .25s ease,transform .25s ease;animation:downArrowFloat 1.8s ease-in-out infinite}
.sage-model .section-scroll:hover{background:#e8ebe1;transform:translateY(3px)}
.sage-model #dress-code{padding-top:24px}
@keyframes downArrowFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}
@media(prefers-reduced-motion:reduce){.sage-model .section-scroll{animation:none}}


/* Sections livre d'or et carte : rythme plus compact sur mobile */
.sage-model .guestbook-section{background:#e8ebe1}
.sage-model .map-section{background:#fbfaf6}
.sage-model .guestbook-section .section-title,
.sage-model .map-section .section-title{margin-bottom:30px}
.sage-model .guestbook-form{gap:12px}
.sage-model .guestbook-empty{margin:18px auto 0}
.sage-model .map-frame{overflow:hidden}
@media(max-width:700px){
  .sage-model .accommodations-section{padding-bottom:34px}
  .sage-model .guestbook-section{padding:48px 7%}
  .sage-model .guestbook-section .section-title{margin-bottom:28px}
  .sage-model .guestbook-form{gap:12px}
  .sage-model .guestbook-form textarea{min-height:120px}
  .sage-model .guestbook-empty{margin:16px auto 0}
  .sage-model .guestbook-messages{margin-top:24px}
  .sage-model .map-section{padding:50px 7%}
  .sage-model .map-section .section-title{margin-bottom:26px}
  .sage-model .map-frame{height:290px;border-width:6px}
  .sage-model .map-links{margin:12px auto 0;gap:12px;flex-direction:column;align-items:center;text-align:center;line-height:1.7}
}

/* Livre d’or : cartes de souvenirs plus raffinées */
.sage-model .guestbook-messages{
  max-width:1040px;
  margin:48px auto 0;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),320px));
  justify-content:center;
  align-items:stretch;
  gap:22px;
}
.sage-model .guestbook-message{
  position:relative;
  min-height:220px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  padding:34px 30px 30px;
  overflow:hidden;
  background:#fbfaf6;
  border:1px solid #e2e5dc;
  box-shadow:0 10px 28px rgba(52,57,47,.045);
  text-align:center;
  transition:transform .35s ease,box-shadow .35s ease,border-color .35s ease;
}
.sage-model .guestbook-message:before{
  content:"";
  position:absolute;
  top:13px;
  left:13px;
  right:13px;
  bottom:13px;
  border:1px solid rgba(135,148,125,.18);
  pointer-events:none;
}
.sage-model .guestbook-message:after{
  content:"";
  width:34px;
  height:1px;
  margin:17px auto 13px;
  background:#b8c1b0;
  order:2;
}
.sage-model .guestbook-message:hover{
  transform:translateY(-5px);
  border-color:#cbd3c5;
  box-shadow:0 16px 34px rgba(52,57,47,.085);
}
.sage-model .guestbook-message>span{
  display:block;
  height:30px;
  font:46px/.9 'Playfair Display',serif;
  color:#87947d;
  order:0;
}
.sage-model .guestbook-message p{
  position:relative;
  z-index:1;
  max-width:100%;
  margin:10px 0 0;
  font:italic 17px/1.85 'Playfair Display',serif;
  color:#42483f;
  overflow-wrap:anywhere;
  white-space:pre-wrap;
  order:1;
}
.sage-model .guestbook-message small{
  position:relative;
  z-index:1;
  display:block;
  margin-top:0;
  font:500 9px 'DM Sans',sans-serif;
  letter-spacing:.2em;
  text-transform:uppercase;
  color:#71806b;
  order:3;
}
@media(max-width:700px){
  .sage-model .guestbook-messages{
    grid-template-columns:minmax(0,1fr);
    max-width:420px;
    gap:16px;
    margin-top:32px;
  }
  .sage-model .guestbook-message{
    min-height:190px;
    padding:30px 26px 26px;
  }
  .sage-model .guestbook-message p{font-size:16px}
}


/* Effet waouh : apparition cinématique du livre d’or et du RSVP */
.sage-model .guestbook-section,
.sage-model .reply-section{position:relative;isolation:isolate;overflow:hidden}
.sage-model .guestbook-section:before,
.sage-model .reply-section:before{
  content:"";
  position:absolute;
  z-index:-1;
  width:420px;height:420px;
  border:1px solid rgba(135,148,125,.13);
  border-radius:50%;
  top:50%;left:50%;
  transform:translate(-50%,-45%) scale(.82);
  box-shadow:0 0 0 34px rgba(135,148,125,.025),0 0 0 68px rgba(135,148,125,.018);
  opacity:0;
  transition:opacity 1.2s ease,transform 1.5s cubic-bezier(.2,.7,.2,1);
  pointer-events:none;
}
.sage-model .guestbook-section.is-visible:before,
.sage-model .reply-section.is-visible:before{opacity:1;transform:translate(-50%,-45%) scale(1)}
.sage-model .guestbook-section .section-title>*,
.sage-model .reply-section>*:not(form):not(.success){
  animation:memoryRise .85s both;
}
.sage-model .guestbook-section .section-title>*:nth-child(1),
.sage-model .reply-section>.tag{animation-delay:.08s}
.sage-model .guestbook-section .section-title>*:nth-child(2),
.sage-model .reply-section>.kicker{animation-delay:.18s}
.sage-model .guestbook-section .section-title>*:nth-child(3),
.sage-model .reply-section>.script{animation-delay:.28s}
.sage-model .guestbook-section .section-title>*:nth-child(4),
.sage-model .reply-section>h2{animation-delay:.38s}
.sage-model .guestbook-section .section-title>*:nth-child(5),
.sage-model .reply-section>.reply-intro{animation-delay:.48s}
.sage-model .guestbook-form,
.sage-model .reply-section form{
  position:relative;
  padding:30px;
  background:rgba(251,250,246,.58);
  border:1px solid rgba(135,148,125,.2);
  box-shadow:0 18px 48px rgba(52,57,47,.055);
  backdrop-filter:blur(5px);
  animation:formFloatIn .95s .35s both;
}
.sage-model .guestbook-form label,
.sage-model .reply-section form>label,
.sage-model .reply-section form>fieldset,
.sage-model .reply-section .guest-picker{
  animation:memoryRise .7s both;
}
.sage-model .guestbook-form label:nth-child(1),
.sage-model .reply-section form>label:nth-child(1){animation-delay:.42s}
.sage-model .guestbook-form label:nth-child(2),
.sage-model .reply-section form>label:nth-child(2){animation-delay:.54s}
.sage-model .reply-section form>fieldset{animation-delay:.66s}
.sage-model .reply-section .guest-picker{animation-delay:.76s}
.sage-model .guestbook-form input,
.sage-model .guestbook-form textarea,
.sage-model .reply-section form input:not([type=radio]),
.sage-model .reply-section form textarea{
  transition:border-color .3s ease,box-shadow .3s ease,background .3s ease,transform .3s ease;
}
.sage-model .guestbook-form input:focus,
.sage-model .guestbook-form textarea:focus,
.sage-model .reply-section form input:not([type=radio]):focus,
.sage-model .reply-section form textarea:focus{
  outline:none;
  border-color:#87947d;
  background:#fffefa;
  box-shadow:0 0 0 4px rgba(135,148,125,.12),0 8px 22px rgba(52,57,47,.06);
  transform:translateY(-1px);
}
.sage-model .guestbook-form button,
.sage-model .reply-section form>button[type=submit]{
  position:relative;
  overflow:hidden;
  box-shadow:0 8px 20px rgba(70,83,66,.13);
}
.sage-model .guestbook-form button:before,
.sage-model .reply-section form>button[type=submit]:before{
  content:"";
  position:absolute;
  top:-80%;left:-35%;
  width:22%;height:260%;
  background:rgba(255,255,255,.22);
  transform:rotate(25deg) translateX(-220%);
  transition:transform .75s ease;
}
.sage-model .guestbook-form button:hover:before,
.sage-model .reply-section form>button[type=submit]:hover:before{transform:rotate(25deg) translateX(720%)}
.sage-model .guestbook-section.is-visible .guestbook-message{
  animation:memoryCardIn .9s cubic-bezier(.2,.75,.25,1) both;
}
.sage-model .guestbook-section.is-visible .guestbook-message:nth-child(2){animation-delay:.14s}
.sage-model .guestbook-section.is-visible .guestbook-message:nth-child(3){animation-delay:.28s}
.sage-model .guestbook-message>span{animation:quoteDrift 4s ease-in-out infinite}
.sage-model .guestbook-message:hover:before{border-color:rgba(135,148,125,.42);transition:border-color .35s ease}
.sage-model .reply-section .tag,
.sage-model .guestbook-section .tag{box-shadow:0 4px 14px rgba(70,83,66,.07)}
.sage-model .reply-section .success,
.sage-model .guestbook-section .success{
  max-width:560px;margin:24px auto;padding:36px 28px;
  background:#fbfaf6;border:1px solid #dfe5d9;
  box-shadow:0 18px 45px rgba(52,57,47,.07);
  animation:memoryCardIn .8s cubic-bezier(.2,.75,.25,1) both;
}
@keyframes memoryRise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes formFloatIn{from{opacity:0;transform:translateY(30px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes memoryCardIn{from{opacity:0;transform:translateY(32px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes quoteDrift{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@media(max-width:700px){
  .sage-model .guestbook-form,.sage-model .reply-section form{padding:22px 17px}
  .sage-model .guestbook-section:before,.sage-model .reply-section:before{width:280px;height:280px}
}
@media(prefers-reduced-motion:reduce){
  .sage-model .guestbook-section:before,.sage-model .reply-section:before{transition:none}
  .sage-model .guestbook-section .section-title>*,.sage-model .reply-section>*,
  .sage-model .guestbook-form,.sage-model .reply-section form,
  .sage-model .guestbook-form label,.sage-model .reply-section form>label,
  .sage-model .reply-section form>fieldset,.sage-model .reply-section .guest-picker,
  .sage-model .guestbook-section.is-visible .guestbook-message,
  .sage-model .guestbook-message>span,.sage-model .reply-section .success,
  .sage-model .guestbook-section .success{animation:none!important;opacity:1;transform:none}
}


/* Les animations du livre d’or et du RSVP se lancent au vrai défilement */
.sage-model .guestbook-section .section-title>*,
.sage-model .reply-section>*:not(form):not(.success),
.sage-model .guestbook-form,
.sage-model .reply-section form,
.sage-model .guestbook-message,
.sage-model .guestbook-empty,
.sage-model .guestbook-form label,
.sage-model .reply-section form>label,
.sage-model .reply-section form>fieldset,
.sage-model .reply-section .guest-picker{animation:none!important}
.sage-model .guestbook-section .section-title,
.sage-model .guestbook-form,
.sage-model .reply-section>*,
.sage-model .guestbook-message,
.sage-model .guestbook-empty{transition:opacity .85s ease,transform .85s cubic-bezier(.2,.7,.2,1),box-shadow .35s ease}
.sage-model .guestbook-section .section-title.reveal-on-scroll,
.sage-model .guestbook-form.reveal-on-scroll,
.sage-model .guestbook-message.reveal-on-scroll,
.sage-model .guestbook-empty.reveal-on-scroll,
.sage-model .reply-section>*:not(.reveal-on-scroll){opacity:1}
.sage-model .guestbook-section .section-title.reveal-on-scroll:not(.is-visible),
.sage-model .guestbook-form.reveal-on-scroll:not(.is-visible),
.sage-model .guestbook-message.reveal-on-scroll:not(.is-visible),
.sage-model .guestbook-empty.reveal-on-scroll:not(.is-visible),
.sage-model .reply-section>*:not(.reveal-on-scroll){opacity:0;transform:translateY(28px)}
.sage-model .guestbook-message.reveal-on-scroll.is-visible{opacity:1;transform:translateY(0)}
.sage-model .guestbook-message:nth-child(2){transition-delay:.12s}
.sage-model .guestbook-message:nth-child(3){transition-delay:.24s}
.sage-model .guestbook-form label,
.sage-model .reply-section form>label,
.sage-model .reply-section form>fieldset,
.sage-model .reply-section .guest-picker{animation:none!important}
@media(prefers-reduced-motion:reduce){
  .sage-model .guestbook-section .section-title,
  .sage-model .guestbook-form,
  .sage-model .guestbook-message,
  .sage-model .guestbook-empty,
  .sage-model .reply-section>*{opacity:1!important;transform:none!important;transition:none!important}
}

</style>
