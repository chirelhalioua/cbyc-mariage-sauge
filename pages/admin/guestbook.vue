<script setup lang="ts">
type Message = { _id: string; name: string; message: string; status: 'pending' | 'approved'; createdAt: string }
const token = ref('')
const messages = ref<Message[]>([])
const errorMessage = ref('')
const loading = ref(false)

async function loadMessages() {
  errorMessage.value = ''
  loading.value = true
  try {
    const result = await $fetch<{ messages: Message[] }>('/api/admin/guestbook', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    messages.value = result.messages
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || 'Impossible de charger les messages.'
  } finally {
    loading.value = false
  }
}

async function moderate(id: string, action: 'approve' | 'delete') {
  errorMessage.value = ''
  try {
    await $fetch(`/api/admin/guestbook/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { action }
    })
    await loadMessages()
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || 'Cette action n’a pas pu être effectuée.'
  }
}
</script>

<template>
  <main class="admin-page">
    <header><a href="/">C by C</a><span>ESPACE PRIVÉ</span></header>
    <section class="admin-content">
      <p class="eyebrow">ÉLISE & ANTOINE · 18 SEPTEMBRE 2027</p>
      <h1>Modération du livre d’or</h1>
      <p class="intro">Connectez-vous avec le code privé des mariés pour lire, publier ou supprimer les messages reçus.</p>
      <form class="login" @submit.prevent="loadMessages">
        <label>Code privé<input v-model="token" type="password" autocomplete="current-password" required placeholder="Votre code d’accès"></label>
        <button type="submit" :disabled="loading">{{ loading ? 'Chargement…' : 'Accéder aux messages' }}</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <div v-if="messages.length" class="messages">
        <article v-for="item in messages" :key="item._id">
          <div class="message-top"><strong>{{ item.name }}</strong><span :class="item.status">{{ item.status === 'approved' ? 'Publié' : 'En attente' }}</span></div>
          <p>{{ item.message }}</p>
          <div class="actions">
            <button v-if="item.status !== 'approved'" @click="moderate(item._id, 'approve')">Publier</button>
            <button class="delete" @click="moderate(item._id, 'delete')">Supprimer</button>
          </div>
        </article>
      </div>
      <p v-else-if="token && !loading && !errorMessage" class="empty">Aucun message pour le moment.</p>
    </section>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Italiana&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
.admin-page{min-height:100vh;background:#fbfaf6;color:#34392f;font-family:'DM Sans',sans-serif}
.admin-page header{height:72px;padding:0 7%;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e7e9e1}
.admin-page header a{font:26px 'Italiana',serif;color:#687764;text-decoration:none}
.admin-page header span,.eyebrow{font-size:9px;letter-spacing:.2em;color:#687764}
.admin-content{max-width:760px;margin:70px auto;padding:0 22px}
.admin-content h1{font:46px 'Italiana',serif;margin:14px 0}
.intro{font-size:13px;line-height:1.8;color:#77796f;max-width:560px}
.login{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:end;margin:34px 0}
.login label{display:grid;gap:8px;font-size:11px;color:#465342}
.login input{padding:13px;border:1px solid #d8d9cf;background:white;font:13px 'DM Sans',sans-serif}
.login button,.actions button{border:0;background:#687764;color:white;padding:14px 18px;font:11px 'DM Sans',sans-serif;cursor:pointer}
.login button:disabled{opacity:.6}
.error{font-size:12px;color:#a34f55}
.messages{display:grid;gap:12px;margin-top:28px}
.messages article{background:white;border:1px solid #e5e8df;padding:22px}
.message-top{display:flex;justify-content:space-between;gap:12px;font-size:12px}
.message-top span{font-size:10px;color:#a36d45}
.message-top span.approved{color:#587451}
.messages article p{font:italic 15px/1.7 'Playfair Display',serif}
.actions{display:flex;gap:8px}
.actions button{padding:10px 14px}
.actions button.delete{background:#f1e2e2;color:#925c62}
.empty{font-size:12px;color:#77796f;margin-top:30px}
@media(max-width:560px){.admin-content{margin:42px auto}.admin-content h1{font-size:36px}.login{grid-template-columns:1fr}.login button{width:100%}}
</style>
