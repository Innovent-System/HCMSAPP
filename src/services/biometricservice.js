// Register biometric
async function registerBiometric(userId, userName) {
    // Server se challenge lo
    const { challenge, rp, user } = await fetch('/auth/biometric/register-start', {
        method: 'POST',
        body: JSON.stringify({ userId, userName }),
    }).then(r => r.json());

    // Credential create karo
    const credential = await navigator.credentials.create({
        publicKey: {
            challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
            rp,
            user: {
                id: Uint8Array.from(user.id, c => c.charCodeAt(0)),
                name: user.name,
                displayName: user.displayName,
            },
            pubKeyCredParams: [{ alg: -7, type: 'public-key' }], // ES256
            authenticatorSelection: {
                authenticatorAttachment: 'platform', // Platform = fingerprint/face
                userVerification: 'required',
            },
            timeout: 60000,
            attestation: 'direct',
        },
    });

    // Server pe save karo
    await fetch('/auth/biometric/register-finish', {
        method: 'POST',
        body: JSON.stringify({
            userId,
            credentialId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
            publicKey: btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject))),
        }),
    });
}

// Login with biometric
async function loginWithBiometric() {
    // Server se challenge lo
    const { challenge, allowCredentials } = await fetch('/auth/biometric/login-start', {
        method: 'POST',
    }).then(r => r.json());

    // Biometric prompt
    const assertion = await navigator.credentials.get({
        publicKey: {
            challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
            allowCredentials: allowCredentials.map(c => ({
                id: Uint8Array.from(atob(c.id), c => c.charCodeAt(0)),
                type: c.type,
            })),
            userVerification: 'required',
            timeout: 60000,
        },
    });

    // Server pe verify karo
    const result = await fetch('/auth/biometric/login-finish', {
        method: 'POST',
        body: JSON.stringify({
            credentialId: btoa(String.fromCharCode(...new Uint8Array(assertion.rawId))),
            authenticatorData: btoa(String.fromCharCode(...new Uint8Array(assertion.response.authenticatorData))),
            clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(assertion.response.clientDataJSON))),
            signature: btoa(String.fromCharCode(...new Uint8Array(assertion.response.signature))),
        }),
    }).then(r => r.json());

    if (result.success) {
        // Login successful
        localStorage.setItem('token', result.token);
    }
}

const isBiometricSupported = async () => {
    if (!window.PublicKeyCredential) return false;
    
    // Platform authenticator available?
    return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
};