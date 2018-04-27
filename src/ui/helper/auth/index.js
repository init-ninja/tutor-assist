import { clientId, scope } from './config'
import { TECHNICAL_ERROR, USER_CANCELLED } from './error-types'

let _googleYolo
let _signInButtonContainer

const bootstrapAuth = (signInButtonContainer) => {
  // Google YOLO (automatic sign-in etc.)
  const googleYoloScript = document.createElement('script')
  googleYoloScript.setAttribute('src', 'https://smartlock.google.com/client')
  document.head.appendChild(googleYoloScript)

  // When no credentials are found, redirect to login page (like in icognito)
  const googlePlatformLibScript = document.createElement('script')
  googlePlatformLibScript.setAttribute('src', 'https://apis.google.com/js/platform.js')
  document.head.appendChild(googlePlatformLibScript)

  _signInButtonContainer = signInButtonContainer
  window.onGoogleYoloLoad = (googleYolo) => {
    _googleYolo = googleYolo
  }
}

const renderSignInButton = () => {
  window.gapi.signin2.render(_signInButtonContainer, {
    'scope': scope,
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': handleSignIn,
    'onfailure': handleSignInError
  })
}

const handleSignIn = (idTokenOrGoogleUser) => {
  // TODO: Call bakend endpoint to generate and set session cookie and request redirect to logged in page
  console.log(idTokenOrGoogleUser)
  console.log(typeof idTokenOrGoogleUser)
  return true // TODO: See usage in &&
}

const handleSignInError = (error) => {
  console.log(error) // TODO: Implement
}

const triggerSignIn = () => new Promise((resolve, reject) => {
  _googleYolo.hint({
    supportedAuthMethods: [
      'https://accounts.google.com'
    ],
    supportedIdTokenProviders: [
      {
        uri: 'https://accounts.google.com',
        clientId: clientId
      }
    ]
  }).then(
    (credential) => credential.idToken && resolve(credential.idToken),
    (error) => {
      switch (error.type) {
        case 'userCanceled':
          reject(new Error(USER_CANCELLED))
          break
        case 'noCredentialsAvailable':
          window.alert('noCredentialsAvailable')
          break
        case 'requestFailed':
        case 'operationCanceled':
        case 'illegalConcurrentRequest':
        case 'initializationError':
        default:
          reject(new Error(TECHNICAL_ERROR))
      }
    }
  )
})

const triggerSignOut = () => {
  _googleYolo.disableAutoSignIn()
}

const tryAutomaticSignIn = () => {
  // Wait for google libs to finish loading
  if (!_googleYolo || !window.gapi.signin2) {
    window.setTimeout(tryAutomaticSignIn, 500)
    return
  }

  return new Promise((resolve, reject) => {
    _googleYolo.retrieve({
      supportedAuthMethods: [
        'https://accounts.google.com'
      ],
      supportedIdTokenProviders: [
        {
          uri: 'https://accounts.google.com',
          clientId: clientId
        }
      ]
    }).then(
      (credential) => credential.idToken && handleSignIn(credential.idToken) && resolve(),
      (error) => {
        if (error.type === 'noCredentialsAvailable') {
          renderSignInButton()
        }
      }
    )
  })
}

export { bootstrapAuth, tryAutomaticSignIn, triggerSignIn, triggerSignOut }
