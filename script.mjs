$(document).ready(function() {
    $('#register-with-payload').click(function() {
        const payload = $('#payload-input').val();

        try {
            const publicKey = JSON.parse(payload).publicKey;

            publicKey.challenge = base64UrlToUint8Array(publicKey.challenge);
            publicKey.user.id = base64UrlToUint8Array(publicKey.user.id);

            navigator.credentials.create({ publicKey })
                .then(function(credential) {
                    console.log('Credential:', credential);

                    const credentialData = {
                        id: credential.id,
                        type: credential.type,
                        rawId: arrayBufferToBase64Url(credential.rawId),
                        response: {
                            clientDataJSON: arrayBufferToBase64Url(credential.response.clientDataJSON),
                            attestationObject: arrayBufferToBase64Url(credential.response.attestationObject)
                        }
                    };

                    $('#response-output').text(JSON.stringify(credentialData, null, 2));
                })
                .catch(function(error) {
                    console.error('WebAuthn Error:', error);
                    $('#response-output').text('Error during registration: ' + error);
                });
        } catch (e) {
            console.error('Invalid JSON payload:', e);
            $('#response-output').text('Invalid JSON payload. Please check the input.');
        }
    });

    function base64UrlToUint8Array(base64UrlString) {
        const padding = '='.repeat((4 - base64UrlString.length % 4) % 4);
        const base64 = (base64UrlString + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    function arrayBufferToBase64Url(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const base64String = window.btoa(binary);
        const base64Url = base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        return base64Url;
    }
});
