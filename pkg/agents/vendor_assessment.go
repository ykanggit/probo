// Copyright (c) 2025 Probo Inc <hello@getprobo.com>.
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

package agents

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
	"github.com/openai/openai-go/packages/param"
	"go.gearno.de/kit/log"
)

type (
	VendorAssessment struct {
		l      *log.Logger
		cfg    Config
		client *openai.Client
	}

	Config struct {
		OpenAIAPIKey string
		Temperature  float64
		ModelName    string
	}

	vendorInfo struct {
		Name                       string   `json:"name"`
		Description                string   `json:"description"`
		Category                   string   `json:"category"`
		HeadquarterAddress         string   `json:"headquarter_address"`
		LegalName                  string   `json:"legal_name"`
		PrivacyPolicyURL           string   `json:"privacy_policy_url"`
		ServiceLevelAgreementURL   string   `json:"service_level_agreement_url"`
		DataProcessingAgreementURL string   `json:"data_processing_agreement_url"`
		SecurityPageURL            string   `json:"security_page_url"`
		TrustPageURL               string   `json:"trust_page_url"`
		TermsOfServiceURL          string   `json:"terms_of_service_url"`
		StatusPageURL              string   `json:"status_page_url"`
		Certifications             []string `json:"certifications"`
	}
)

const (
	systemPrompt = `
		# Role: You are a compliance assistant.

		# Objective
		Your task is to fetch the provided company URL and to return comprehensive company information.

		# For the company url, return the following fields in structured JSON format:
		- name: The company's commonly used name
		- description: One-sentence summary of the company's core offering
		- headquarter_address: Company's main headquarter full address
		- legal_name: Official registered company name
		- privacy_policy_url: URL to privacy policy page
		- service_level_agreement_url: URL to SLA page
		- data_processing_agreement_url: URL to DPA page
		- security_page_url: URL to security information page
		- trust_page_url: URL to trust/compliance page
		- terms_of_service_url: URL to terms of service page
		- status_page_url: URL to system status page
		- certifications: Array of security/compliance certifications (e.g., ["SOC2", "ISO27001"])

		# SOP
		- Please ensure the output is clean, standardized JSON.
		- Use web search to gather info, if you cannot find what you are looking for, just return an empty string instead
		- For URLs, return the full URL if found, otherwise an empty string
		- For certifications, return an empty array if none found

		# **Example output format:**
		Respond ONLY with a JSON object. No explanation, no markdown, no preamble. Like this:
		{
			"name": "Stripe",
			"description": "Online payment processing platform that enables businesses to accept and manage digital payments, supporting various payment methods and currencies with integrated fraud protection and compliance features",
			"headquarter_address": "San Francisco, CA",
			"legal_name": "Stripe, Inc.",
			"privacy_policy_url": "https://stripe.com/privacy",
			"service_level_agreement_url": "https://stripe.com/sla",
			"data_processing_agreement_url": "https://stripe.com/dpa",
			"security_page_url": "https://stripe.com/security",
			"trust_page_url": "https://stripe.com/trust",
			"terms_of_service_url": "https://stripe.com/terms",
			"status_page_url": "https://status.stripe.com",
			"certifications": ["SOC1", "SOC2", "PCI DSS Level 1", "ISO 27001"]
		}

		### Company url:
	`
)

func NewVendorAssessment(l *log.Logger, cfg Config) *VendorAssessment {
	client := openai.NewClient(option.WithAPIKey(cfg.OpenAIAPIKey))

	return &VendorAssessment{l: l, cfg: cfg, client: &client}
}

func (va *VendorAssessment) Fetch(ctx context.Context, websiteURL string) (*vendorInfo, error) {
	model := openai.ChatModel(va.cfg.ModelName)
	chatCompletion, err := va.client.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(systemPrompt),
			openai.UserMessage(websiteURL),
		},
		Model:       model,
		Temperature: param.NewOpt(va.cfg.Temperature),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to parse vendor info: %w", err)
	}

	if len(chatCompletion.Choices) == 0 {
		return nil, fmt.Errorf("no completion choices returned from API")
	}

	var vendorInfo vendorInfo
	err = json.Unmarshal([]byte(chatCompletion.Choices[0].Message.Content), &vendorInfo)
	if err != nil {
		return nil, fmt.Errorf("failed to parse vendor info: %w", err)
	}

	return &vendorInfo, nil
}
