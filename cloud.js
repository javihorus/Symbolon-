(() => {
  const cfg = window.SYMBOLON_CLOUD_CONFIG || {};
  let client=null, user=null, callback=null;
  const isConfigured=()=>Boolean(cfg.url && cfg.anonKey && window.supabase);
  const emit=()=>callback?.({configured:isConfigured(),user});

  function isAuthCallbackUrl(){
    const h=location.hash||'';
    const q=location.search||'';
    return /(?:access_token|refresh_token|type|error_description)=/i.test(h) || /(?:^|[?&])code=/i.test(q);
  }

  async function init(cb){
    callback=cb;
    if(!isConfigured()){emit();return;}

    // Supabase normally inspects and may rewrite the URL fragment during startup.
    // Symbolon also uses the fragment as its SPA router (#card/c01, #guided, etc.).
    // Only let Supabase consume the URL when this really is an auth callback.
    client=window.supabase.createClient(cfg.url,cfg.anonKey,{
      auth:{detectSessionInUrl:isAuthCallbackUrl()}
    });

    const {data}=await client.auth.getSession();
    user=data?.session?.user||null;
    emit();
    client.auth.onAuthStateChange((_e,s)=>{user=s?.user||null;emit();});
  }

  async function signIn(email){
    if(!client) throw new Error('Supabase no está configurado');
    const redirectTo=location.origin+location.pathname;
    const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:redirectTo}});
    if(error) throw error;
  }
  async function signOut(){ if(client) await client.auth.signOut(); }
  async function loadState(){ if(!client||!user)return null; const {data,error}=await client.from(cfg.table||'symbolon_user_state').select('state,updated_at').eq('user_id',user.id).maybeSingle(); if(error) throw error; return data?{...(data.state||{}),_cloudUpdatedAt:data.updated_at}:null; }
  async function saveState(state){ if(!client||!user)return; const payload={user_id:user.id,state,updated_at:new Date().toISOString()}; const {error}=await client.from(cfg.table||'symbolon_user_state').upsert(payload,{onConflict:'user_id'}); if(error) throw error; }
  window.SymbolonCloud={init,isConfigured,signIn,signOut,loadState,saveState,getUser:()=>user};
})();
