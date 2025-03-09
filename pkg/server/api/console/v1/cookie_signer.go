package console_v1

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"strings"
)

func signCookieValue(value string, secret string) string {
	if secret == "" {
		panic(fmt.Errorf("cookie secret is not set"))
	}

	h := hmac.New(sha256.New, []byte(secret))

	h.Write([]byte(value))

	signature := base64.URLEncoding.EncodeToString(h.Sum(nil))

	return fmt.Sprintf("%s.%s", value, signature)
}

func verifyCookieValue(signedValue string, secret string) (string, error) {
	if secret == "" {
		panic(fmt.Errorf("cookie secret is not set"))
	}

	parts := strings.Split(signedValue, ".")
	if len(parts) != 2 {
		return "", fmt.Errorf("invalid signed cookie format")
	}

	value, signature := parts[0], parts[1]

	expectedSignedValue := signCookieValue(value, secret)
	expectedParts := strings.Split(expectedSignedValue, ".")
	if len(expectedParts) != 2 {
		return "", fmt.Errorf("error computing signature")
	}

	expectedSignature := expectedParts[1]

	if signature != expectedSignature {
		return "", fmt.Errorf("cookie signature verification failed")
	}

	return value, nil
}
