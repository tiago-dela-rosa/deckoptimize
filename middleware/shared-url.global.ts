export default defineNuxtRouteMiddleware((to) => {
  // Only run on client-side for the main page
  if (process.server || to.path !== '/') return

  // Check if URL contains shared configuration data
  const hasSharedData = to.query.data && typeof to.query.data === 'string'
  
  if (hasSharedData) {
    console.log('Shared URL detected in middleware')
    // Set loading state in a global store/composable
    const nuxtApp = useNuxtApp()
    nuxtApp.$router.options.scrollBehavior = () => ({ top: 0 })
    
    // Store the shared data state for the page to access
    const hasSharedUrlState = useState('hasSharedUrl', () => false)
    const sharedUrlDataState = useState('sharedUrlData', () => null)
    
    hasSharedUrlState.value = true
    sharedUrlDataState.value = to.query.data
  } else {
    // Clear any previous shared URL state
    const hasSharedUrlState = useState('hasSharedUrl', () => false)
    const sharedUrlDataState = useState('sharedUrlData', () => null)
    
    hasSharedUrlState.value = false
    sharedUrlDataState.value = null
  }
})