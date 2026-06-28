# Database Schema Snapshot

Project: `https://dyjiyzcsdaeuxtueslqr.supabase.co`
Captured via DATABASE_URL pooler. User schemas only (Supabase/system schemas excluded).

## Schemas

- `Yef`
- `assets`
- `auth`
- `campaign`
- `canvas`
- `chat`
- `comms`
- `content`
- `docs`
- `email`
- `events`
- `flow`
- `forms`
- `grey`
- `notes`
- `office`
- `pods`
- `public`
- `storage`

## Tables

### `auth.audit_log_entries`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| instance_id | uuid | yes |  |
| id 🔑 | uuid | no |  |
| payload | json | yes |  |
| created_at | timestamp with time zone | yes |  |
| ip_address | character varying | no | `''::character varying` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX audit_log_entries_pkey ON auth.audit_log_entries USING btree (id)`
- `CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id)`

### `auth.custom_oauth_providers`  ·  0 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| provider_type | text | no |  |
| identifier | text | no |  |
| name | text | no |  |
| client_id | text | no |  |
| client_secret | text | no |  |
| acceptable_client_ids | ARRAY | no | `'{}'::text[]` |
| scopes | ARRAY | no | `'{}'::text[]` |
| pkce_enabled | boolean | no | `true` |
| attribute_mapping | jsonb | no | `'{}'::jsonb` |
| authorization_params | jsonb | no | `'{}'::jsonb` |
| enabled | boolean | no | `true` |
| email_optional | boolean | no | `false` |
| issuer | text | yes |  |
| discovery_url | text | yes |  |
| skip_nonce_check | boolean | no | `false` |
| cached_discovery | jsonb | yes |  |
| discovery_cached_at | timestamp with time zone | yes |  |
| authorization_url | text | yes |  |
| token_url | text | yes |  |
| userinfo_url | text | yes |  |
| jwks_uri | text | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Checks:**
- custom_oauth_providers_authorization_url_https: `CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text)))`
- custom_oauth_providers_authorization_url_length: `CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048)))`
- custom_oauth_providers_client_id_length: `CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512)))`
- custom_oauth_providers_discovery_url_length: `CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048)))`
- custom_oauth_providers_identifier_format: `CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text))`
- custom_oauth_providers_issuer_length: `CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048))))`
- custom_oauth_providers_jwks_uri_https: `CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text)))`
- custom_oauth_providers_jwks_uri_length: `CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048)))`
- custom_oauth_providers_name_length: `CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100)))`
- custom_oauth_providers_oauth2_requires_endpoints: `CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL))))`
- custom_oauth_providers_oidc_discovery_url_https: `CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text)))`
- custom_oauth_providers_oidc_issuer_https: `CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text)))`
- custom_oauth_providers_oidc_requires_issuer: `CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL)))`
- custom_oauth_providers_provider_type_check: `CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text])))`
- custom_oauth_providers_token_url_https: `CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text)))`
- custom_oauth_providers_token_url_length: `CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048)))`
- custom_oauth_providers_userinfo_url_https: `CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text)))`
- custom_oauth_providers_userinfo_url_length: `CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))`

**Indexes:**
- `CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at)`
- `CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled)`
- `CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier)`
- `CREATE UNIQUE INDEX custom_oauth_providers_identifier_key ON auth.custom_oauth_providers USING btree (identifier)`
- `CREATE UNIQUE INDEX custom_oauth_providers_pkey ON auth.custom_oauth_providers USING btree (id)`
- `CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type)`

### `auth.flow_state`  ·  1 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| user_id | uuid | yes |  |
| auth_code | text | yes |  |
| code_challenge_method | code_challenge_method | yes |  |
| code_challenge | text | yes |  |
| provider_type | text | no |  |
| provider_access_token | text | yes |  |
| provider_refresh_token | text | yes |  |
| created_at | timestamp with time zone | yes |  |
| updated_at | timestamp with time zone | yes |  |
| authentication_method | text | no |  |
| auth_code_issued_at | timestamp with time zone | yes |  |
| invite_token | text | yes |  |
| referrer | text | yes |  |
| oauth_client_state_id | uuid | yes |  |
| linking_target_id | uuid | yes |  |
| email_optional | boolean | no | `false` |

**PK:** id

**Indexes:**
- `CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC)`
- `CREATE UNIQUE INDEX flow_state_pkey ON auth.flow_state USING btree (id)`
- `CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code)`
- `CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method)`

### `auth.identities`  ·  2 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| provider_id | text | no |  |
| user_id | uuid | no |  |
| identity_data | jsonb | no |  |
| provider | text | no |  |
| last_sign_in_at | timestamp with time zone | yes |  |
| created_at | timestamp with time zone | yes |  |
| updated_at | timestamp with time zone | yes |  |
| email | text | yes |  |
| id 🔑 | uuid | no | `gen_random_uuid()` |

**PK:** id

**Indexes:**
- `CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops)`
- `CREATE UNIQUE INDEX identities_pkey ON auth.identities USING btree (id)`
- `CREATE UNIQUE INDEX identities_provider_id_provider_unique ON auth.identities USING btree (provider_id, provider)`
- `CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id)`

### `auth.instances`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| uuid | uuid | yes |  |
| raw_base_config | text | yes |  |
| created_at | timestamp with time zone | yes |  |
| updated_at | timestamp with time zone | yes |  |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX instances_pkey ON auth.instances USING btree (id)`

### `auth.mfa_amr_claims`  ·  19 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| session_id | uuid | no |  |
| created_at | timestamp with time zone | no |  |
| updated_at | timestamp with time zone | no |  |
| authentication_method | text | no |  |
| id 🔑 | uuid | no |  |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX amr_id_pk ON auth.mfa_amr_claims USING btree (id)`
- `CREATE UNIQUE INDEX mfa_amr_claims_session_id_authentication_method_pkey ON auth.mfa_amr_claims USING btree (session_id, authentication_method)`

### `auth.mfa_challenges`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| factor_id | uuid | no |  |
| created_at | timestamp with time zone | no |  |
| verified_at | timestamp with time zone | yes |  |
| ip_address | inet | no |  |
| otp_code | text | yes |  |
| web_authn_session_data | jsonb | yes |  |

**PK:** id

**Indexes:**
- `CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC)`
- `CREATE UNIQUE INDEX mfa_challenges_pkey ON auth.mfa_challenges USING btree (id)`

### `auth.mfa_factors`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| user_id | uuid | no |  |
| friendly_name | text | yes |  |
| factor_type | factor_type | no |  |
| status | factor_status | no |  |
| created_at | timestamp with time zone | no |  |
| updated_at | timestamp with time zone | no |  |
| secret | text | yes |  |
| phone | text | yes |  |
| last_challenged_at | timestamp with time zone | yes |  |
| web_authn_credential | jsonb | yes |  |
| web_authn_aaguid | uuid | yes |  |
| last_webauthn_challenge_data | jsonb | yes |  |

**PK:** id

**Indexes:**
- `CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at)`
- `CREATE UNIQUE INDEX mfa_factors_last_challenged_at_key ON auth.mfa_factors USING btree (last_challenged_at)`
- `CREATE UNIQUE INDEX mfa_factors_pkey ON auth.mfa_factors USING btree (id)`
- `CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text)`
- `CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id)`
- `CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone)`

### `auth.oauth_authorizations`  ·  0 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| authorization_id | text | no |  |
| client_id | uuid | no |  |
| user_id | uuid | yes |  |
| redirect_uri | text | no |  |
| scope | text | no |  |
| state | text | yes |  |
| resource | text | yes |  |
| code_challenge | text | yes |  |
| code_challenge_method | code_challenge_method | yes |  |
| response_type | oauth_response_type | no | `'code'::auth.oauth_response_type` |
| status | oauth_authorization_status | no | `'pending'::auth.oauth_authorization_status` |
| authorization_code | text | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| expires_at | timestamp with time zone | no | `(now() + '00:03:00'::interval)` |
| approved_at | timestamp with time zone | yes |  |
| nonce | text | yes |  |

**PK:** id

**Checks:**
- oauth_authorizations_authorization_code_length: `CHECK ((char_length(authorization_code) <= 255))`
- oauth_authorizations_code_challenge_length: `CHECK ((char_length(code_challenge) <= 128))`
- oauth_authorizations_expires_at_future: `CHECK ((expires_at > created_at))`
- oauth_authorizations_nonce_length: `CHECK ((char_length(nonce) <= 255))`
- oauth_authorizations_redirect_uri_length: `CHECK ((char_length(redirect_uri) <= 2048))`
- oauth_authorizations_resource_length: `CHECK ((char_length(resource) <= 2048))`
- oauth_authorizations_scope_length: `CHECK ((char_length(scope) <= 4096))`
- oauth_authorizations_state_length: `CHECK ((char_length(state) <= 4096))`

**Indexes:**
- `CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status)`
- `CREATE UNIQUE INDEX oauth_authorizations_authorization_code_key ON auth.oauth_authorizations USING btree (authorization_code)`
- `CREATE UNIQUE INDEX oauth_authorizations_authorization_id_key ON auth.oauth_authorizations USING btree (authorization_id)`
- `CREATE UNIQUE INDEX oauth_authorizations_pkey ON auth.oauth_authorizations USING btree (id)`

### `auth.oauth_client_states`  ·  0 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| provider_type | text | no |  |
| code_verifier | text | yes |  |
| created_at | timestamp with time zone | no |  |

**PK:** id

**Indexes:**
- `CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at)`
- `CREATE UNIQUE INDEX oauth_client_states_pkey ON auth.oauth_client_states USING btree (id)`

### `auth.oauth_clients`  ·  0 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| client_secret_hash | text | yes |  |
| registration_type | oauth_registration_type | no |  |
| redirect_uris | text | no |  |
| grant_types | text | no |  |
| client_name | text | yes |  |
| client_uri | text | yes |  |
| logo_uri | text | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |
| deleted_at | timestamp with time zone | yes |  |
| client_type | oauth_client_type | no | `'confidential'::auth.oauth_client_type` |
| token_endpoint_auth_method | text | no |  |

**PK:** id

**Checks:**
- oauth_clients_client_name_length: `CHECK ((char_length(client_name) <= 1024))`
- oauth_clients_client_uri_length: `CHECK ((char_length(client_uri) <= 2048))`
- oauth_clients_logo_uri_length: `CHECK ((char_length(logo_uri) <= 2048))`
- oauth_clients_token_endpoint_auth_method_check: `CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))`

**Indexes:**
- `CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at)`
- `CREATE UNIQUE INDEX oauth_clients_pkey ON auth.oauth_clients USING btree (id)`

### `auth.oauth_consents`  ·  0 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| user_id | uuid | no |  |
| client_id | uuid | no |  |
| scopes | text | no |  |
| granted_at | timestamp with time zone | no | `now()` |
| revoked_at | timestamp with time zone | yes |  |

**PK:** id

**Checks:**
- oauth_consents_revoked_after_granted: `CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at)))`
- oauth_consents_scopes_length: `CHECK ((char_length(scopes) <= 2048))`
- oauth_consents_scopes_not_empty: `CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))`

**Indexes:**
- `CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL)`
- `CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL)`
- `CREATE UNIQUE INDEX oauth_consents_pkey ON auth.oauth_consents USING btree (id)`
- `CREATE UNIQUE INDEX oauth_consents_user_client_unique ON auth.oauth_consents USING btree (user_id, client_id)`
- `CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC)`

### `auth.one_time_tokens`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| user_id | uuid | no |  |
| token_type | one_time_token_type | no |  |
| token_hash | text | no |  |
| relates_to | text | no |  |
| created_at | timestamp without time zone | no | `now()` |
| updated_at | timestamp without time zone | no | `now()` |

**PK:** id

**Checks:**
- one_time_tokens_token_hash_check: `CHECK ((char_length(token_hash) > 0))`

**Indexes:**
- `CREATE UNIQUE INDEX one_time_tokens_pkey ON auth.one_time_tokens USING btree (id)`
- `CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to)`
- `CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash)`
- `CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type)`

### `auth.refresh_tokens`  ·  399 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| instance_id | uuid | yes |  |
| id 🔑 | bigint | no | `nextval('auth.refresh_tokens_id_seq'::regclass)` |
| token | character varying | yes |  |
| user_id | character varying | yes |  |
| revoked | boolean | yes |  |
| created_at | timestamp with time zone | yes |  |
| updated_at | timestamp with time zone | yes |  |
| parent | character varying | yes |  |
| session_id | uuid | yes |  |

**PK:** id

**Indexes:**
- `CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id)`
- `CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id)`
- `CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent)`
- `CREATE UNIQUE INDEX refresh_tokens_pkey ON auth.refresh_tokens USING btree (id)`
- `CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked)`
- `CREATE UNIQUE INDEX refresh_tokens_token_unique ON auth.refresh_tokens USING btree (token)`
- `CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC)`

### `auth.saml_providers`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| sso_provider_id | uuid | no |  |
| entity_id | text | no |  |
| metadata_xml | text | no |  |
| metadata_url | text | yes |  |
| attribute_mapping | jsonb | yes |  |
| created_at | timestamp with time zone | yes |  |
| updated_at | timestamp with time zone | yes |  |
| name_id_format | text | yes |  |

**PK:** id

**Checks:**
- entity_id not empty: `CHECK ((char_length(entity_id) > 0))`
- metadata_url not empty: `CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0)))`
- metadata_xml not empty: `CHECK ((char_length(metadata_xml) > 0))`

**Indexes:**
- `CREATE UNIQUE INDEX saml_providers_entity_id_key ON auth.saml_providers USING btree (entity_id)`
- `CREATE UNIQUE INDEX saml_providers_pkey ON auth.saml_providers USING btree (id)`
- `CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id)`

### `auth.saml_relay_states`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| sso_provider_id | uuid | no |  |
| request_id | text | no |  |
| for_email | text | yes |  |
| redirect_to | text | yes |  |
| created_at | timestamp with time zone | yes |  |
| updated_at | timestamp with time zone | yes |  |
| flow_state_id | uuid | yes |  |

**PK:** id

**Checks:**
- request_id not empty: `CHECK ((char_length(request_id) > 0))`

**Indexes:**
- `CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC)`
- `CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email)`
- `CREATE UNIQUE INDEX saml_relay_states_pkey ON auth.saml_relay_states USING btree (id)`
- `CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id)`

### `auth.schema_migrations`  ·  76 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| version | character varying | no |  |

**Indexes:**
- `CREATE UNIQUE INDEX schema_migrations_pkey ON auth.schema_migrations USING btree (version)`

### `auth.sessions`  ·  19 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| user_id | uuid | no |  |
| created_at | timestamp with time zone | yes |  |
| updated_at | timestamp with time zone | yes |  |
| factor_id | uuid | yes |  |
| aal | aal_level | yes |  |
| not_after | timestamp with time zone | yes |  |
| refreshed_at | timestamp without time zone | yes |  |
| user_agent | text | yes |  |
| ip | inet | yes |  |
| tag | text | yes |  |
| oauth_client_id | uuid | yes |  |
| refresh_token_hmac_key | text | yes |  |
| refresh_token_counter | bigint | yes |  |
| scopes | text | yes |  |

**PK:** id

**Checks:**
- sessions_scopes_length: `CHECK ((char_length(scopes) <= 4096))`

**Indexes:**
- `CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC)`
- `CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id)`
- `CREATE UNIQUE INDEX sessions_pkey ON auth.sessions USING btree (id)`
- `CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id)`
- `CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at)`

### `auth.sso_domains`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| sso_provider_id | uuid | no |  |
| domain | text | no |  |
| created_at | timestamp with time zone | yes |  |
| updated_at | timestamp with time zone | yes |  |

**PK:** id

**Checks:**
- domain not empty: `CHECK ((char_length(domain) > 0))`

**Indexes:**
- `CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain))`
- `CREATE UNIQUE INDEX sso_domains_pkey ON auth.sso_domains USING btree (id)`
- `CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id)`

### `auth.sso_providers`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| resource_id | text | yes |  |
| created_at | timestamp with time zone | yes |  |
| updated_at | timestamp with time zone | yes |  |
| disabled | boolean | yes |  |

**PK:** id

**Checks:**
- resource_id not empty: `CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))`

**Indexes:**
- `CREATE UNIQUE INDEX sso_providers_pkey ON auth.sso_providers USING btree (id)`
- `CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id))`
- `CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops)`

### `auth.users`  ·  2 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| instance_id | uuid | yes |  |
| id 🔑 | uuid | no |  |
| aud | character varying | yes |  |
| role | character varying | yes |  |
| email | character varying | yes |  |
| encrypted_password | character varying | yes |  |
| email_confirmed_at | timestamp with time zone | yes |  |
| invited_at | timestamp with time zone | yes |  |
| confirmation_token | character varying | yes |  |
| confirmation_sent_at | timestamp with time zone | yes |  |
| recovery_token | character varying | yes |  |
| recovery_sent_at | timestamp with time zone | yes |  |
| email_change_token_new | character varying | yes |  |
| email_change | character varying | yes |  |
| email_change_sent_at | timestamp with time zone | yes |  |
| last_sign_in_at | timestamp with time zone | yes |  |
| raw_app_meta_data | jsonb | yes |  |
| raw_user_meta_data | jsonb | yes |  |
| is_super_admin | boolean | yes |  |
| created_at | timestamp with time zone | yes |  |
| updated_at | timestamp with time zone | yes |  |
| phone | text | yes | `NULL::character varying` |
| phone_confirmed_at | timestamp with time zone | yes |  |
| phone_change | text | yes | `''::character varying` |
| phone_change_token | character varying | yes | `''::character varying` |
| phone_change_sent_at | timestamp with time zone | yes |  |
| confirmed_at | timestamp with time zone | yes |  |
| email_change_token_current | character varying | yes | `''::character varying` |
| email_change_confirm_status | smallint | yes | `0` |
| banned_until | timestamp with time zone | yes |  |
| reauthentication_token | character varying | yes | `''::character varying` |
| reauthentication_sent_at | timestamp with time zone | yes |  |
| is_sso_user | boolean | no | `false` |
| deleted_at | timestamp with time zone | yes |  |
| is_anonymous | boolean | no | `false` |

**PK:** id

**Checks:**
- users_email_change_confirm_status_check: `CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))`

**Indexes:**
- `CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text)`
- `CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text)`
- `CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text)`
- `CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text)`
- `CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text)`
- `CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false)`
- `CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text))`
- `CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id)`
- `CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous)`
- `CREATE UNIQUE INDEX users_phone_key ON auth.users USING btree (phone)`
- `CREATE UNIQUE INDEX users_pkey ON auth.users USING btree (id)`

### `auth.webauthn_challenges`  ·  0 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| user_id | uuid | yes |  |
| challenge_type | text | no |  |
| session_data | jsonb | no |  |
| created_at | timestamp with time zone | no | `now()` |
| expires_at | timestamp with time zone | no |  |

**PK:** id

**Checks:**
- webauthn_challenges_challenge_type_check: `CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))`

**Indexes:**
- `CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at)`
- `CREATE UNIQUE INDEX webauthn_challenges_pkey ON auth.webauthn_challenges USING btree (id)`
- `CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id)`

### `auth.webauthn_credentials`  ·  0 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| user_id | uuid | no |  |
| credential_id | bytea | no |  |
| public_key | bytea | no |  |
| attestation_type | text | no | `''::text` |
| aaguid | uuid | yes |  |
| sign_count | bigint | no | `0` |
| transports | jsonb | no | `'[]'::jsonb` |
| backup_eligible | boolean | no | `false` |
| backed_up | boolean | no | `false` |
| friendly_name | text | no | `''::text` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |
| last_used_at | timestamp with time zone | yes |  |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id)`
- `CREATE UNIQUE INDEX webauthn_credentials_pkey ON auth.webauthn_credentials USING btree (id)`
- `CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id)`

### `email.api_keys`  ·  1 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| name | text | no |  |
| project | text | no | `'geiger-flow'::text` |
| prefix | text | no |  |
| key_hash | text | no |  |
| active | boolean | no | `true` |
| created_by | uuid | yes |  |
| last_used_at | timestamp with time zone | yes |  |
| created_at | timestamp with time zone | no | `now()` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX api_keys_key_hash_key ON email.api_keys USING btree (key_hash)`
- `CREATE UNIQUE INDEX api_keys_pkey ON email.api_keys USING btree (id)`
- `CREATE INDEX email_api_keys_active_idx ON email.api_keys USING btree (active)`

### `email.messages`  ·  4 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| template_key | text | yes |  |
| project | text | yes |  |
| to_address | text | no |  |
| from_address | text | no |  |
| subject | text | no |  |
| html | text | yes |  |
| status | text | no | `'queued'::text` |
| provider | text | no | `'resend'::text` |
| provider_id | text | yes |  |
| error | text | yes |  |
| data | jsonb | no | `'{}'::jsonb` |
| api_key_id | uuid | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| sent_at | timestamp with time zone | yes |  |

**PK:** id

**Checks:**
- messages_status_check: `CHECK ((status = ANY (ARRAY['queued'::text, 'sent'::text, 'failed'::text])))`

**Indexes:**
- `CREATE INDEX email_messages_created_idx ON email.messages USING btree (created_at DESC)`
- `CREATE INDEX email_messages_status_idx ON email.messages USING btree (status)`
- `CREATE INDEX email_messages_template_idx ON email.messages USING btree (template_key)`
- `CREATE UNIQUE INDEX messages_pkey ON email.messages USING btree (id)`

**RLS policies:**
- Authenticated read messages (SELECT) roles={public} using=`(auth.role() = 'authenticated'::text)`

### `email.templates`  ·  13 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| key | text | no |  |
| project | text | no | `'geiger-flow'::text` |
| category | text | no | `'General'::text` |
| name | text | no |  |
| description | text | no | `''::text` |
| subject | text | no | `''::text` |
| content | jsonb | no | `'{}'::jsonb` |
| fields | jsonb | no | `'[]'::jsonb` |
| sample_data | jsonb | no | `'{}'::jsonb` |
| variables | jsonb | no | `'[]'::jsonb` |
| status | text | no | `'active'::text` |
| version | integer | no | `1` |
| updated_by | uuid | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Checks:**
- templates_status_check: `CHECK ((status = ANY (ARRAY['active'::text, 'draft'::text, 'archived'::text])))`

**Indexes:**
- `CREATE INDEX email_templates_project_idx ON email.templates USING btree (project, category)`
- `CREATE INDEX email_templates_status_idx ON email.templates USING btree (status)`
- `CREATE UNIQUE INDEX templates_key_key ON email.templates USING btree (key)`
- `CREATE UNIQUE INDEX templates_pkey ON email.templates USING btree (id)`

**RLS policies:**
- Authenticated manage templates (ALL) roles={public} using=`(auth.role() = 'authenticated'::text)` check=`(auth.role() = 'authenticated'::text)`

### `flow.goals`  ·  2 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| project_id | uuid | no |  |
| objective_id | uuid | yes |  |
| title | text | no |  |
| description | text | yes |  |
| status | text | no | `'not_started'::text` |
| owner | text | yes |  |
| progress | integer | no | `0` |
| target_date | date | yes |  |
| position | integer | no | `0` |
| metadata | jsonb | no | `'{}'::jsonb` |
| created_by | uuid | yes |  |
| deleted_at | timestamp with time zone | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Foreign keys:**
- objective_id → `flow.objectives.id`

**Indexes:**
- `CREATE INDEX goals_objective_idx ON flow.goals USING btree (objective_id, "position")`
- `CREATE UNIQUE INDEX goals_pkey ON flow.goals USING btree (id)`
- `CREATE INDEX goals_project_idx ON flow.goals USING btree (project_id, status, target_date)`

**RLS policies:**
- goals_delete (DELETE) roles={public} using=`flow.has_ability(project_id, 'goals.delete'::text)`
- goals_insert (INSERT) roles={public} check=`flow.has_ability(project_id, 'goals.create'::text)`
- goals_select (SELECT) roles={public} using=`flow.has_ability(project_id, 'goals.view'::text)`
- goals_update (UPDATE) roles={public} using=`flow.has_ability(project_id, 'goals.update'::text)` check=`flow.has_ability(project_id, 'goals.update'::text)`

### `flow.issue_comments`  ·  1 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| issue_id | uuid | no |  |
| author_id | uuid | yes |  |
| body | text | no |  |
| attachments | jsonb | no | `'[]'::jsonb` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Foreign keys:**
- issue_id → `flow.issues.id`

**Indexes:**
- `CREATE INDEX issue_comments_issue_idx ON flow.issue_comments USING btree (issue_id, created_at)`
- `CREATE UNIQUE INDEX issue_comments_pkey ON flow.issue_comments USING btree (id)`

**RLS policies:**
- issue_comments_delete (DELETE) roles={public} using=`(EXISTS ( SELECT 1
   FROM flow.issues i
  WHERE ((i.id = issue_comments.issue_id) AND flow.has_ability(i.project_id, 'issues.comment'::text))))`
- issue_comments_insert (INSERT) roles={public} check=`(EXISTS ( SELECT 1
   FROM flow.issues i
  WHERE ((i.id = issue_comments.issue_id) AND flow.has_ability(i.project_id, 'issues.comment'::text))))`
- issue_comments_select (SELECT) roles={public} using=`(EXISTS ( SELECT 1
   FROM flow.issues i
  WHERE ((i.id = issue_comments.issue_id) AND flow.has_ability(i.project_id, 'issues.view'::text))))`
- issue_comments_update (UPDATE) roles={public} using=`(EXISTS ( SELECT 1
   FROM flow.issues i
  WHERE ((i.id = issue_comments.issue_id) AND flow.has_ability(i.project_id, 'issues.comment'::text))))` check=`(EXISTS ( SELECT 1
   FROM flow.issues i
  WHERE ((i.id = issue_comments.issue_id) AND flow.has_ability(i.project_id, 'issues.comment'::text))))`

### `flow.issues`  ·  1 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| project_id | uuid | no |  |
| title | text | no |  |
| description | text | yes |  |
| status | text | no | `'open'::text` |
| priority | text | no | `'medium'::text` |
| labels | ARRAY | no | `'{}'::text[]` |
| assignee_ids | ARRAY | no | `'{}'::uuid[]` |
| due_date | date | yes |  |
| created_by | uuid | yes |  |
| deleted_at | timestamp with time zone | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |
| metadata | jsonb | no | `'{}'::jsonb` |

**PK:** id

**Indexes:**
- `CREATE INDEX issues_assignees_idx ON flow.issues USING gin (assignee_ids)`
- `CREATE INDEX issues_labels_idx ON flow.issues USING gin (labels)`
- `CREATE UNIQUE INDEX issues_pkey ON flow.issues USING btree (id)`
- `CREATE INDEX issues_project_idx ON flow.issues USING btree (project_id, status, priority, due_date)`

**RLS policies:**
- issues_delete (DELETE) roles={public} using=`flow.has_ability(project_id, 'issues.delete'::text)`
- issues_insert (INSERT) roles={public} check=`flow.has_ability(project_id, 'issues.create'::text)`
- issues_select (SELECT) roles={public} using=`flow.has_ability(project_id, 'issues.view'::text)`
- issues_update (UPDATE) roles={public} using=`flow.has_ability(project_id, 'issues.update'::text)` check=`flow.has_ability(project_id, 'issues.update'::text)`

### `flow.milestones`  ·  1 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| project_id | uuid | no |  |
| title | text | no |  |
| description | text | yes |  |
| status | text | no | `'not_started'::text` |
| owner | text | yes |  |
| target_date | date | yes |  |
| metadata | jsonb | no | `'{}'::jsonb` |
| created_by | uuid | yes |  |
| deleted_at | timestamp with time zone | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX milestones_pkey ON flow.milestones USING btree (id)`
- `CREATE INDEX milestones_project_idx ON flow.milestones USING btree (project_id, target_date)`

**RLS policies:**
- milestones_delete (DELETE) roles={public} using=`flow.has_ability(project_id, 'milestones.delete'::text)`
- milestones_insert (INSERT) roles={public} check=`flow.has_ability(project_id, 'milestones.create'::text)`
- milestones_select (SELECT) roles={public} using=`flow.has_ability(project_id, 'milestones.view'::text)`
- milestones_update (UPDATE) roles={public} using=`flow.has_ability(project_id, 'milestones.update'::text)` check=`flow.has_ability(project_id, 'milestones.update'::text)`

### `flow.objectives`  ·  1 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| project_id | uuid | no |  |
| title | text | no |  |
| description | text | yes |  |
| status | text | no | `'not_started'::text` |
| owner | text | yes |  |
| progress | integer | no | `0` |
| start_date | date | yes |  |
| target_date | date | yes |  |
| metadata | jsonb | no | `'{}'::jsonb` |
| created_by | uuid | yes |  |
| deleted_at | timestamp with time zone | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX objectives_pkey ON flow.objectives USING btree (id)`
- `CREATE INDEX objectives_project_idx ON flow.objectives USING btree (project_id, status, target_date)`

**RLS policies:**
- objectives_delete (DELETE) roles={public} using=`flow.has_ability(project_id, 'objectives.delete'::text)`
- objectives_insert (INSERT) roles={public} check=`flow.has_ability(project_id, 'objectives.create'::text)`
- objectives_select (SELECT) roles={public} using=`flow.has_ability(project_id, 'objectives.view'::text)`
- objectives_update (UPDATE) roles={public} using=`flow.has_ability(project_id, 'objectives.update'::text)` check=`flow.has_ability(project_id, 'objectives.update'::text)`

### `flow.open_module`  ·  5 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| module 🔑 | text | no |  |

**PK:** module

**Indexes:**
- `CREATE UNIQUE INDEX open_module_pkey ON flow.open_module USING btree (module)`

### `flow.role_ability`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| organization_id 🔑 | uuid | no |  |
| role_key 🔑 | text | no |  |
| ability 🔑 | text | no |  |
| created_at | timestamp with time zone | no | `now()` |

**PK:** organization_id, role_key, ability

**Indexes:**
- `CREATE UNIQUE INDEX role_ability_pkey ON flow.role_ability USING btree (organization_id, role_key, ability)`

**RLS policies:**
- role_ability_read (SELECT) roles={public} using=`flow.is_org_member(organization_id)`
- role_ability_write (ALL) roles={public} using=`(EXISTS ( SELECT 1
   FROM organizations o
  WHERE ((o.id = role_ability.organization_id) AND (o.created_by = auth.uid()))))` check=`(EXISTS ( SELECT 1
   FROM organizations o
  WHERE ((o.id = role_ability.organization_id) AND (o.created_by = auth.uid()))))`

### `flow.task_comments`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| task_id | uuid | no |  |
| author_id | uuid | yes |  |
| body | text | no |  |
| attachments | jsonb | no | `'[]'::jsonb` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Foreign keys:**
- task_id → `flow.tasks.id`

**Indexes:**
- `CREATE UNIQUE INDEX task_comments_pkey ON flow.task_comments USING btree (id)`
- `CREATE INDEX task_comments_task_idx ON flow.task_comments USING btree (task_id, created_at)`

**RLS policies:**
- task_comments_delete (DELETE) roles={public} using=`(EXISTS ( SELECT 1
   FROM flow.tasks t
  WHERE ((t.id = task_comments.task_id) AND flow.has_ability(t.project_id, 'tasks.comment'::text))))`
- task_comments_insert (INSERT) roles={public} check=`(EXISTS ( SELECT 1
   FROM flow.tasks t
  WHERE ((t.id = task_comments.task_id) AND flow.has_ability(t.project_id, 'tasks.comment'::text))))`
- task_comments_select (SELECT) roles={public} using=`(EXISTS ( SELECT 1
   FROM flow.tasks t
  WHERE ((t.id = task_comments.task_id) AND flow.has_ability(t.project_id, 'tasks.view'::text))))`
- task_comments_update (UPDATE) roles={public} using=`(EXISTS ( SELECT 1
   FROM flow.tasks t
  WHERE ((t.id = task_comments.task_id) AND flow.has_ability(t.project_id, 'tasks.comment'::text))))` check=`(EXISTS ( SELECT 1
   FROM flow.tasks t
  WHERE ((t.id = task_comments.task_id) AND flow.has_ability(t.project_id, 'tasks.comment'::text))))`

### `flow.tasks`  ·  1 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| project_id | uuid | no |  |
| title | text | no |  |
| description | text | yes |  |
| status | text | no | `'todo'::text` |
| priority | text | no | `'medium'::text` |
| stage | text | yes |  |
| type | text | no | `'task'::text` |
| progress | numeric | no | `0` |
| labels | ARRAY | no | `'{}'::text[]` |
| assignee_ids | ARRAY | no | `'{}'::uuid[]` |
| parent_link | text | yes |  |
| start_date | date | yes |  |
| due_date | date | yes |  |
| git_branch | text | yes |  |
| latest_update | text | yes |  |
| deadline_tracking | text | yes |  |
| reminders | jsonb | no | `'[]'::jsonb` |
| role_visibility | text | yes |  |
| custom_fields | jsonb | no | `'{}'::jsonb` |
| created_by | uuid | yes |  |
| completed_by | uuid | yes |  |
| completed_at | timestamp with time zone | yes |  |
| deleted_at | timestamp with time zone | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |
| metadata | jsonb | no | `'{}'::jsonb` |

**PK:** id

**Indexes:**
- `CREATE INDEX tasks_assignees_idx ON flow.tasks USING gin (assignee_ids)`
- `CREATE INDEX tasks_labels_idx ON flow.tasks USING gin (labels)`
- `CREATE UNIQUE INDEX tasks_pkey ON flow.tasks USING btree (id)`
- `CREATE INDEX tasks_project_idx ON flow.tasks USING btree (project_id, status, priority, due_date)`

**RLS policies:**
- tasks_delete (DELETE) roles={public} using=`flow.has_ability(project_id, 'tasks.delete'::text)`
- tasks_insert (INSERT) roles={public} check=`flow.has_ability(project_id, 'tasks.create'::text)`
- tasks_select (SELECT) roles={public} using=`flow.has_ability(project_id, 'tasks.view'::text)`
- tasks_update (UPDATE) roles={public} using=`flow.has_ability(project_id, 'tasks.update'::text)` check=`flow.has_ability(project_id, 'tasks.update'::text)`

### `public._prisma_migrations`  ·  1 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | character varying | no |  |
| checksum | character varying | no |  |
| finished_at | timestamp with time zone | yes |  |
| migration_name | character varying | no |  |
| logs | text | yes |  |
| rolled_back_at | timestamp with time zone | yes |  |
| started_at | timestamp with time zone | no | `now()` |
| applied_steps_count | integer | no | `0` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX _prisma_migrations_pkey ON public._prisma_migrations USING btree (id)`

### `public.base`  ·  2 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| user_id | uuid | no |  |
| viewport | text | yes |  |
| nodes | text | yes |  |
| edges | text | yes |  |
| preference | jsonb | yes | `'{}'::jsonb` |
| created_at | timestamp with time zone | yes | `CURRENT_TIMESTAMP` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX base_pkey ON public.base USING btree (id)`

### `public.boards`  ·  13 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| name | text | no | `'Untitled Board'::text` |
| description | text | yes |  |
| nodes | text | yes |  |
| edges | text | yes |  |
| viewport | text | yes |  |
| created_at | timestamp with time zone | yes | `CURRENT_TIMESTAMP` |
| updated_at | timestamp with time zone | yes | `CURRENT_TIMESTAMP` |
| user_id | uuid | yes |  |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX boards_pkey ON public.boards USING btree (id)`

### `public.canvas_boards`  ·  1 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| project_id | uuid | yes |  |
| user_id | uuid | no |  |
| name | text | no | `'Untitled Board'::text` |
| description | text | no | `''::text` |
| elements | jsonb | no | `'[]'::jsonb` |
| app_state | jsonb | no | `'{}'::jsonb` |
| files | jsonb | no | `'{}'::jsonb` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX canvas_boards_pkey ON public.canvas_boards USING btree (id)`
- `CREATE INDEX canvas_boards_project_id_idx ON public.canvas_boards USING btree (project_id)`
- `CREATE INDEX canvas_boards_updated_at_idx ON public.canvas_boards USING btree (updated_at DESC)`
- `CREATE INDEX canvas_boards_user_id_idx ON public.canvas_boards USING btree (user_id)`

**RLS policies:**
- Users can create own boards (INSERT) roles={public} check=`(auth.uid() = user_id)`
- Users can delete own boards (DELETE) roles={public} using=`(auth.uid() = user_id)`
- Users can update own boards (UPDATE) roles={public} using=`(auth.uid() = user_id)`
- Users can view own boards (SELECT) roles={public} using=`(auth.uid() = user_id)`

### `public.collab`  ·  8 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| host | uuid | yes |  |
| joiners | jsonb | yes | `'{}'::jsonb` |
| code | text | yes |  |
| state_nodes | text | yes |  |
| state_edges | text | yes |  |
| preference | jsonb | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| rollback | jsonb | yes |  |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX collab_pkey ON public.collab USING btree (id)`

### `public.dash_blog_categories`  ·  4 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| name | text | no |  |
| slug | text | no |  |
| description | text | yes |  |
| color | text | yes | `'#10b981'::text` |
| created_at | timestamp with time zone | no | `now()` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX dash_blog_categories_name_key ON public.dash_blog_categories USING btree (name)`
- `CREATE UNIQUE INDEX dash_blog_categories_pkey ON public.dash_blog_categories USING btree (id)`
- `CREATE UNIQUE INDEX dash_blog_categories_slug_key ON public.dash_blog_categories USING btree (slug)`
- `CREATE INDEX idx_blog_categories_slug ON public.dash_blog_categories USING btree (slug)`

**RLS policies:**
- Authenticated users can manage blog categories (ALL) roles={public} using=`(auth.role() = 'authenticated'::text)` check=`(auth.role() = 'authenticated'::text)`
- Blog categories are viewable by everyone (SELECT) roles={public} using=`true`

### `public.dash_blog_posts`  ·  4 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| title | text | no |  |
| slug | text | no |  |
| excerpt | text | no |  |
| content | text | no |  |
| author_id | uuid | yes |  |
| author_name | text | no |  |
| author_avatar | text | yes |  |
| category | text | no |  |
| tags | ARRAY | yes | `'{}'::text[]` |
| featured_image | text | yes |  |
| is_published | boolean | no | `false` |
| is_featured | boolean | no | `false` |
| published_at | timestamp with time zone | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |
| reading_time_minutes | integer | yes | `5` |
| views | integer | yes | `0` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX dash_blog_posts_pkey ON public.dash_blog_posts USING btree (id)`
- `CREATE UNIQUE INDEX dash_blog_posts_slug_key ON public.dash_blog_posts USING btree (slug)`
- `CREATE INDEX idx_blog_posts_author_id ON public.dash_blog_posts USING btree (author_id)`
- `CREATE INDEX idx_blog_posts_category ON public.dash_blog_posts USING btree (category)`
- `CREATE INDEX idx_blog_posts_is_featured ON public.dash_blog_posts USING btree (is_featured)`
- `CREATE INDEX idx_blog_posts_is_published ON public.dash_blog_posts USING btree (is_published)`
- `CREATE INDEX idx_blog_posts_published_at ON public.dash_blog_posts USING btree (published_at DESC)`
- `CREATE INDEX idx_blog_posts_slug ON public.dash_blog_posts USING btree (slug)`

**RLS policies:**
- Authenticated users can manage blog posts (ALL) roles={public} using=`(auth.role() = 'authenticated'::text)` check=`(auth.role() = 'authenticated'::text)`
- Published blog posts are viewable by everyone (SELECT) roles={public} using=`(is_published = true)`

### `public.dash_changelog`  ·  7 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| version | text | no |  |
| title | text | no |  |
| description | text | no |  |
| category | text | no |  |
| product | text | no |  |
| release_date | timestamp with time zone | no | `now()` |
| is_featured | boolean | no | `false` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |
| image_url | text | yes | `''::text` |

**PK:** id

**Checks:**
- dash_changelog_category_check: `CHECK ((category = ANY (ARRAY['feature'::text, 'improvement'::text, 'bugfix'::text, 'breaking'::text])))`
- dash_changelog_product_check: `CHECK ((product = ANY (ARRAY['geiger-flow'::text, 'geiger-notes'::text, 'geiger-dash'::text, 'geiger-dam'::text, 'geiger-grey'::text])))`

**Indexes:**
- `CREATE UNIQUE INDEX dash_changelog_pkey ON public.dash_changelog USING btree (id)`
- `CREATE INDEX idx_changelog_category ON public.dash_changelog USING btree (category)`
- `CREATE INDEX idx_changelog_date ON public.dash_changelog USING btree (release_date DESC)`
- `CREATE INDEX idx_changelog_featured ON public.dash_changelog USING btree (is_featured)`
- `CREATE INDEX idx_changelog_product ON public.dash_changelog USING btree (product)`

**RLS policies:**
- Authenticated users can insert changelogs (INSERT) roles={public} check=`(auth.role() = 'authenticated'::text)`
- Authenticated users can update changelogs (UPDATE) roles={public} using=`(auth.role() = 'authenticated'::text)`
- Public changelogs are viewable by everyone (SELECT) roles={public} using=`true`

### `public.dash_changelog_items`  ·  27 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| changelog_id | uuid | no |  |
| type | text | no |  |
| description | text | no |  |
| created_at | timestamp with time zone | no | `now()` |

**PK:** id

**Foreign keys:**
- changelog_id → `public.dash_changelog.id`

**Checks:**
- dash_changelog_items_type_check: `CHECK ((type = ANY (ARRAY['added'::text, 'changed'::text, 'fixed'::text, 'removed'::text, 'deprecated'::text])))`

**Indexes:**
- `CREATE UNIQUE INDEX dash_changelog_items_pkey ON public.dash_changelog_items USING btree (id)`
- `CREATE INDEX idx_changelog_items_changelog_id ON public.dash_changelog_items USING btree (changelog_id)`

**RLS policies:**
- Authenticated users can delete changelog items (DELETE) roles={public} using=`(auth.role() = 'authenticated'::text)`
- Authenticated users can insert changelog items (INSERT) roles={public} check=`(auth.role() = 'authenticated'::text)`
- Authenticated users can update changelog items (UPDATE) roles={public} using=`(auth.role() = 'authenticated'::text)`
- Public changelog items are viewable by everyone (SELECT) roles={public} using=`true`

### `public.docs_content_blocks`  ·  26 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| page_id | uuid | no |  |
| anchor_id | text | no |  |
| block_type | text | no | `'section'::text` |
| eyebrow | text | yes |  |
| title | text | no |  |
| body | jsonb | no | `'[]'::jsonb` |
| cards | jsonb | no | `'[]'::jsonb` |
| features | jsonb | no | `'[]'::jsonb` |
| links | jsonb | no | `'[]'::jsonb` |
| sort_order | integer | no | `0` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Foreign keys:**
- page_id → `public.docs_pages.id`

**Checks:**
- docs_content_blocks_block_type_check: `CHECK ((block_type = 'section'::text))`

**Indexes:**
- `CREATE UNIQUE INDEX docs_content_blocks_page_id_anchor_id_key ON public.docs_content_blocks USING btree (page_id, anchor_id)`
- `CREATE INDEX docs_content_blocks_page_idx ON public.docs_content_blocks USING btree (page_id, sort_order)`
- `CREATE UNIQUE INDEX docs_content_blocks_pkey ON public.docs_content_blocks USING btree (id)`

**RLS policies:**
- Authenticated users manage docs blocks (ALL) roles={public} using=`(auth.role() = 'authenticated'::text)` check=`(auth.role() = 'authenticated'::text)`
- Published docs blocks are public (SELECT) roles={public} using=`(EXISTS ( SELECT 1
   FROM docs_pages
  WHERE ((docs_pages.id = docs_content_blocks.page_id) AND (docs_pages.status = 'published'::text))))`

### `public.docs_nav_groups`  ·  4 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| title | text | no |  |
| slug | text | no |  |
| sort_order | integer | no | `0` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX docs_nav_groups_pkey ON public.docs_nav_groups USING btree (id)`
- `CREATE UNIQUE INDEX docs_nav_groups_slug_key ON public.docs_nav_groups USING btree (slug)`

**RLS policies:**
- Authenticated users manage docs nav groups (ALL) roles={public} using=`(auth.role() = 'authenticated'::text)` check=`(auth.role() = 'authenticated'::text)`
- Docs nav groups are public (SELECT) roles={public} using=`true`

### `public.docs_pages`  ·  24 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| nav_group_id | uuid | no |  |
| slug | text | no |  |
| title | text | no |  |
| nav_label | text | yes |  |
| description | text | no | `''::text` |
| preview | text | yes |  |
| toc | jsonb | no | `'[]'::jsonb` |
| status | text | no | `'draft'::text` |
| sort_order | integer | no | `0` |
| has_children | boolean | no | `false` |
| published_at | timestamp with time zone | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Foreign keys:**
- nav_group_id → `public.docs_nav_groups.id`

**Checks:**
- docs_pages_status_check: `CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))`

**Indexes:**
- `CREATE INDEX docs_pages_nav_group_idx ON public.docs_pages USING btree (nav_group_id, sort_order)`
- `CREATE UNIQUE INDEX docs_pages_pkey ON public.docs_pages USING btree (id)`
- `CREATE UNIQUE INDEX docs_pages_slug_key ON public.docs_pages USING btree (slug)`
- `CREATE INDEX docs_pages_status_idx ON public.docs_pages USING btree (status)`

**RLS policies:**
- Authenticated users manage docs pages (ALL) roles={public} using=`(auth.role() = 'authenticated'::text)` check=`(auth.role() = 'authenticated'::text)`
- Published docs pages are public (SELECT) roles={public} using=`(status = 'published'::text)`

### `public.documents`  ·  4 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| content | jsonb | yes | `'{}'::jsonb` |
| created_at | timestamp with time zone | yes | `CURRENT_TIMESTAMP` |
| updated_at | timestamp with time zone | yes | `CURRENT_TIMESTAMP` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id)`

### `public.flow_forms`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| project_id | uuid | no |  |
| title | text | no |  |
| description | text | yes |  |
| status | text | no | `'draft'::text` |
| schema | jsonb | no | `'{}'::jsonb` |
| settings | jsonb | no | `'{}'::jsonb` |
| created_by | uuid | yes |  |
| published_at | timestamp with time zone | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Checks:**
- flow_forms_status_check: `CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'closed'::text, 'archived'::text])))`

**Indexes:**
- `CREATE UNIQUE INDEX flow_forms_pkey ON public.flow_forms USING btree (id)`
- `CREATE INDEX flow_forms_project_idx ON public.flow_forms USING btree (project_id, created_at DESC)`

**RLS policies:**
- flow_forms_project_access (ALL) roles={public} using=`((auth.uid() IS NOT NULL) AND flow_can_access_project(project_id))` check=`((auth.uid() IS NOT NULL) AND flow_can_access_project(project_id))`

### `public.flow_issue_comments`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| issue_id | uuid | no |  |
| author_id | uuid | yes |  |
| body | text | no |  |
| attachments | jsonb | no | `'[]'::jsonb` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Foreign keys:**
- issue_id → `public.flow_issues.id`

**Indexes:**
- `CREATE INDEX flow_issue_comments_issue_idx ON public.flow_issue_comments USING btree (issue_id, created_at DESC)`
- `CREATE UNIQUE INDEX flow_issue_comments_pkey ON public.flow_issue_comments USING btree (id)`

**RLS policies:**
- flow_issue_comments_authenticated (ALL) roles={public} using=`((auth.uid() IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM flow_issues i
  WHERE ((i.id = flow_issue_comments.issue_id) AND flow_can_access_project(i.project_id)))))` check=`((auth.uid() IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM flow_issues i
  WHERE ((i.id = flow_issue_comments.issue_id) AND flow_can_access_project(i.project_id)))))`

### `public.flow_issues`  ·  1 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| project_id | uuid | no |  |
| title | text | no |  |
| description | text | yes |  |
| status | text | no | `'backlog'::text` |
| priority | text | no | `'none'::text` |
| labels | ARRAY | no | `ARRAY[]::text[]` |
| assignee_ids | ARRAY | no | `ARRAY[]::uuid[]` |
| due_date | date | yes |  |
| deleted_at | timestamp with time zone | yes |  |
| created_by | uuid | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Checks:**
- flow_issues_priority_check: `CHECK ((priority = ANY (ARRAY['none'::text, 'low'::text, 'medium'::text, 'high'::text, 'urgent'::text])))`
- flow_issues_status_check: `CHECK ((status = ANY (ARRAY['backlog'::text, 'todo'::text, 'in_progress'::text, 'in_review'::text, 'done'::text, 'cancelled'::text])))`

**Indexes:**
- `CREATE INDEX flow_issues_due_date_idx ON public.flow_issues USING btree (project_id, due_date) WHERE ((deleted_at IS NULL) AND (due_date IS NOT NULL))`
- `CREATE INDEX flow_issues_labels_idx ON public.flow_issues USING gin (labels)`
- `CREATE UNIQUE INDEX flow_issues_pkey ON public.flow_issues USING btree (id)`
- `CREATE INDEX flow_issues_project_idx ON public.flow_issues USING btree (project_id, created_at DESC) WHERE (deleted_at IS NULL)`
- `CREATE INDEX flow_issues_project_status_priority_idx ON public.flow_issues USING btree (project_id, status, priority) WHERE (deleted_at IS NULL)`

**RLS policies:**
- flow_issues_authenticated (ALL) roles={public} using=`((auth.uid() IS NOT NULL) AND flow_can_access_project(project_id))` check=`((auth.uid() IS NOT NULL) AND flow_can_access_project(project_id))`

### `public.flow_notifications`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| user_id | uuid | no |  |
| type | text | no | `'general'::text` |
| title | text | no |  |
| description | text | yes |  |
| icon | text | yes |  |
| icon_color | text | yes |  |
| bg_color | text | yes |  |
| extra | jsonb | no | `'{}'::jsonb` |
| read | boolean | no | `false` |
| time | timestamp with time zone | no | `now()` |
| created_at | timestamp with time zone | no | `now()` |

**PK:** id

**Checks:**
- flow_notifications_type_check: `CHECK ((type = ANY (ARRAY['general'::text, 'discussion'::text, 'mention'::text, 'file'::text, 'actions'::text])))`

**Indexes:**
- `CREATE UNIQUE INDEX flow_notifications_pkey ON public.flow_notifications USING btree (id)`
- `CREATE INDEX flow_notifications_user_idx ON public.flow_notifications USING btree (user_id, "time" DESC)`
- `CREATE INDEX flow_notifications_user_unread_idx ON public.flow_notifications USING btree (user_id, read) WHERE (read = false)`

**RLS policies:**
- flow_notifications_owner (ALL) roles={public} using=`(auth.uid() = user_id)` check=`(auth.uid() = user_id)`

### `public.flow_profiles`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no |  |
| organization_id | uuid | yes |  |
| display_name | text | yes |  |
| email | text | yes |  |
| avatar_url | text | yes |  |
| position | text | yes |  |
| role | text | no | `'workspace_owner'::text` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Foreign keys:**
- organization_id → `public.organizations.id`

**Indexes:**
- `CREATE INDEX flow_profiles_organization_idx ON public.flow_profiles USING btree (organization_id)`
- `CREATE UNIQUE INDEX flow_profiles_pkey ON public.flow_profiles USING btree (id)`

**RLS policies:**
- flow_profiles_self_or_org (ALL) roles={public} using=`((auth.uid() IS NOT NULL) AND ((id = auth.uid()) OR ((organization_id IS NOT NULL) AND (organization_id = flow_current_org()))))` check=`((auth.uid() IS NOT NULL) AND ((id = auth.uid()) OR ((organization_id IS NOT NULL) AND (organization_id = flow_current_org()))))`

### `public.flow_tasks`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| project_id | uuid | no |  |
| title | text | no |  |
| description | text | yes |  |
| status | text | no | `'todo'::text` |
| priority | text | no | `'medium'::text` |
| stage | text | no | `'backlog'::text` |
| type | text | no | `'task'::text` |
| progress | numeric | yes | `0` |
| labels | ARRAY | no | `ARRAY[]::text[]` |
| assignee_ids | ARRAY | no | `ARRAY[]::uuid[]` |
| parent_link | text | yes |  |
| start_date | date | yes |  |
| due_date | date | yes |  |
| deadline_tracking | text | yes | `'not_set'::text` |
| git_branch | text | yes |  |
| reminders | jsonb | no | `'[]'::jsonb` |
| role_visibility | text | no | `'team'::text` |
| latest_update | text | yes |  |
| custom_fields | jsonb | no | `'{}'::jsonb` |
| created_by | uuid | yes |  |
| completed_by | uuid | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |
| completed_at | timestamp with time zone | yes |  |
| deleted_at | timestamp with time zone | yes |  |

**PK:** id

**Foreign keys:**
- project_id → `public.projects.id`

**Checks:**
- flow_tasks_deadline_tracking_check: `CHECK ((deadline_tracking = ANY (ARRAY['on_track'::text, 'at_risk'::text, 'overdue'::text, 'not_set'::text])))`
- flow_tasks_priority_check: `CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])))`
- flow_tasks_progress_check: `CHECK (((progress >= (0)::numeric) AND (progress <= (100)::numeric)))`
- flow_tasks_role_visibility_check: `CHECK ((role_visibility = ANY (ARRAY['team'::text, 'pm_tl'::text, 'dev_only'::text, 'private'::text])))`
- flow_tasks_status_check: `CHECK ((status = ANY (ARRAY['todo'::text, 'in_progress'::text, 'blocked'::text, 'done'::text, 'draft'::text, 'cancelled'::text, 'archived'::text, 'in_review'::text])))`
- flow_tasks_type_check: `CHECK ((type = ANY (ARRAY['task'::text, 'issue'::text, 'bug'::text, 'feature'::text, 'improvement'::text])))`

**Indexes:**
- `CREATE INDEX flow_tasks_assignee_ids_idx ON public.flow_tasks USING gin (assignee_ids)`
- `CREATE INDEX flow_tasks_due_date_idx ON public.flow_tasks USING btree (project_id, due_date) WHERE ((deleted_at IS NULL) AND (due_date IS NOT NULL))`
- `CREATE INDEX flow_tasks_labels_idx ON public.flow_tasks USING gin (labels)`
- `CREATE UNIQUE INDEX flow_tasks_pkey ON public.flow_tasks USING btree (id)`
- `CREATE INDEX flow_tasks_project_idx ON public.flow_tasks USING btree (project_id, created_at DESC) WHERE (deleted_at IS NULL)`
- `CREATE INDEX flow_tasks_project_status_priority_idx ON public.flow_tasks USING btree (project_id, status, priority) WHERE (deleted_at IS NULL)`

**RLS policies:**
- flow_tasks_authenticated (ALL) roles={public} using=`((auth.uid() IS NOT NULL) AND flow_can_access_project(project_id))` check=`((auth.uid() IS NOT NULL) AND flow_can_access_project(project_id))`

### `public.flow_teams`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| organization_id | uuid | yes |  |
| project_id | uuid | yes |  |
| name | text | no | `'Core Team'::text` |
| members | jsonb | no | `'[]'::jsonb` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Foreign keys:**
- organization_id → `public.organizations.id`

**Indexes:**
- `CREATE INDEX flow_teams_org_idx ON public.flow_teams USING btree (organization_id)`
- `CREATE UNIQUE INDEX flow_teams_pkey ON public.flow_teams USING btree (id)`
- `CREATE INDEX flow_teams_project_idx ON public.flow_teams USING btree (project_id)`

**RLS policies:**
- flow_teams_member (ALL) roles={public} using=`((auth.uid() IS NOT NULL) AND (flow_can_access_project(id) OR ((project_id IS NOT NULL) AND flow_can_access_project(project_id)) OR ((organization_id IS NOT NULL) AND (organization_id = flow_current_org()))))` check=`((auth.uid() IS NOT NULL) AND (flow_can_access_project(id) OR ((project_id IS NOT NULL) AND flow_can_access_project(project_id)) OR ((organization_id IS NOT NULL) AND (organization_id = flow_current_org()))))`

### `public.flow_workspace_roles`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| organization_id | uuid | no |  |
| role_key | text | no |  |
| name | text | no |  |
| description | text | yes |  |
| permissions | jsonb | no | `'{}'::jsonb` |
| is_system | boolean | no | `false` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Foreign keys:**
- organization_id → `public.organizations.id`

**Indexes:**
- `CREATE INDEX flow_workspace_roles_org_idx ON public.flow_workspace_roles USING btree (organization_id, created_at)`
- `CREATE UNIQUE INDEX flow_workspace_roles_organization_id_role_key_key ON public.flow_workspace_roles USING btree (organization_id, role_key)`
- `CREATE UNIQUE INDEX flow_workspace_roles_pkey ON public.flow_workspace_roles USING btree (id)`

**RLS policies:**
- flow_workspace_roles_org (ALL) roles={public} using=`((auth.uid() IS NOT NULL) AND (organization_id = flow_current_org()))` check=`((auth.uid() IS NOT NULL) AND (organization_id = flow_current_org()))`

### `public.office_file_shares`  ·  1 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| file_id | uuid | no |  |
| email | text | no |  |
| user_id | uuid | yes |  |
| role | text | no | `'viewer'::text` |
| created_at | timestamp with time zone | no | `now()` |

**PK:** id

**Foreign keys:**
- file_id → `public.office_files.id`

**Checks:**
- office_file_shares_role_check: `CHECK ((role = ANY (ARRAY['viewer'::text, 'commenter'::text, 'editor'::text])))`

**Indexes:**
- `CREATE INDEX office_file_shares_email_idx ON public.office_file_shares USING btree (lower(email))`
- `CREATE UNIQUE INDEX office_file_shares_file_id_email_key ON public.office_file_shares USING btree (file_id, email)`
- `CREATE INDEX office_file_shares_file_idx ON public.office_file_shares USING btree (file_id)`
- `CREATE UNIQUE INDEX office_file_shares_pkey ON public.office_file_shares USING btree (id)`
- `CREATE INDEX office_file_shares_user_idx ON public.office_file_shares USING btree (user_id)`

**RLS policies:**
- Invitee views own share (SELECT) roles={public} using=`((user_id = auth.uid()) OR (lower(email) = lower((auth.jwt() ->> 'email'::text))))`
- Owner manages shares (ALL) roles={public} using=`(EXISTS ( SELECT 1
   FROM office_files f
  WHERE ((f.id = office_file_shares.file_id) AND (f.user_id = auth.uid()))))` check=`(EXISTS ( SELECT 1
   FROM office_files f
  WHERE ((f.id = office_file_shares.file_id) AND (f.user_id = auth.uid()))))`

### `public.office_files`  ·  8 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| user_id | uuid | no |  |
| type | text | no |  |
| name | text | no | `'Untitled'::text` |
| content | jsonb | no | `'{}'::jsonb` |
| thumbnail | text | yes |  |
| starred | boolean | no | `false` |
| trashed | boolean | no | `false` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |
| visibility | text | no | `'restricted'::text` |
| link_role | text | no | `'viewer'::text` |
| folder_id | uuid | yes |  |
| project_id | text | yes |  |

**PK:** id

**Foreign keys:**
- folder_id → `public.office_folders.id`

**Checks:**
- office_files_link_role_check: `CHECK ((link_role = ANY (ARRAY['viewer'::text, 'commenter'::text, 'editor'::text])))`
- office_files_type_check: `CHECK ((type = ANY (ARRAY['document'::text, 'spreadsheet'::text, 'presentation'::text])))`
- office_files_visibility_check: `CHECK ((visibility = ANY (ARRAY['restricted'::text, 'link'::text])))`

**Indexes:**
- `CREATE INDEX office_files_folder_idx ON public.office_files USING btree (user_id, folder_id)`
- `CREATE UNIQUE INDEX office_files_pkey ON public.office_files USING btree (id)`
- `CREATE INDEX office_files_user_starred_idx ON public.office_files USING btree (user_id, starred)`
- `CREATE INDEX office_files_user_type_idx ON public.office_files USING btree (user_id, type)`
- `CREATE INDEX office_files_user_updated_idx ON public.office_files USING btree (user_id, trashed, updated_at DESC)`

**RLS policies:**
- Update editable files (UPDATE) roles={public} using=`can_edit_file(id)` check=`can_edit_file(id)`
- Users can create own files (INSERT) roles={public} check=`(auth.uid() = user_id)`
- Users can delete own files (DELETE) roles={public} using=`(auth.uid() = user_id)`
- View accessible files (SELECT) roles={public} using=`can_view_file(id)`

### `public.office_folders`  ·  1 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| user_id | uuid | no |  |
| name | text | no | `'Untitled folder'::text` |
| color | text | no | `'#4285f4'::text` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX office_folders_pkey ON public.office_folders USING btree (id)`
- `CREATE INDEX office_folders_user_idx ON public.office_folders USING btree (user_id, updated_at DESC)`

**RLS policies:**
- Users can create own folders (INSERT) roles={public} check=`(auth.uid() = user_id)`
- Users can delete own folders (DELETE) roles={public} using=`(auth.uid() = user_id)`
- Users can update own folders (UPDATE) roles={public} using=`(auth.uid() = user_id)`
- Users can view own folders (SELECT) roles={public} using=`(auth.uid() = user_id)`

### `public.organization_project`  ·  2 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| created_at | timestamp with time zone | no | `now()` |
| project | uuid | yes |  |
| organisition | uuid | yes |  |
| plan | uuid | yes |  |

**PK:** id

**Foreign keys:**
- organisition → `public.organizations.id`
- plan → `public.plan.id`
- project → `public.projects.id`

**Indexes:**
- `CREATE UNIQUE INDEX organization_project_pkey ON public.organization_project USING btree (id)`

### `public.organization_users`  ·  0 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| created_at | timestamp with time zone | no | `now()` |
| user | uuid | yes |  |
| organization | uuid | yes |  |
| role | Role | yes | `'User'::"Role"` |

**PK:** id

**Foreign keys:**
- organization → `public.organizations.id`

**Indexes:**
- `CREATE UNIQUE INDEX organization_users_pkey ON public.organization_users USING btree (id)`

### `public.organizations`  ·  1 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| name | text | yes |  |
| description | text | no | `''::text` |
| created_by | uuid | yes |  |
| created_at | timestamp with time zone | yes | `now()` |
| owner | uuid | yes |  |
| metadata | jsonb | yes |  |
| is_active | boolean | yes | `false` |
| country | text | yes |  |
| phone | text | yes |  |
| slug | text | yes |  |
| deleted_at | timestamp with time zone | yes |  |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id)`

### `public.plan`  ·  2 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| created_at | timestamp with time zone | no | `now()` |
| organisation | uuid | yes |  |
| plan | jsonb | yes |  |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX plan_pkey ON public.plan USING btree (id)`

### `public.projects`  ·  3 rows  ·  RLS off

| column | type | null | default |
|---|---|---|---|
| flow_project_id | uuid | no | `gen_random_uuid()` |
| created_at | timestamp with time zone | no | `now()` |
| dam_project_id | uuid | yes | `gen_random_uuid()` |
| notes_project_id | uuid | yes | `gen_random_uuid()` |
| grey_project_id | uuid | yes | `gen_random_uuid()` |
| office_project_id | uuid | yes | `gen_random_uuid()` |
| forms_project_id | uuid | yes | `gen_random_uuid()` |
| events_project_id | uuid | yes | `gen_random_uuid()` |
| content_project_id | uuid | yes | `gen_random_uuid()` |
| pods_project_id | uuid | yes | `gen_random_uuid()` |
| comms_project_id | uuid | yes | `gen_random_uuid()` |
| chat_project_id | uuid | yes | `gen_random_uuid()` |
| canvas_project_id | uuid | yes | `gen_random_uuid()` |
| docs_project_id | uuid | yes | `gen_random_uuid()` |
| id 🔑 | uuid | no | `gen_random_uuid()` |
| name | text | yes |  |
| slug | text | yes |  |
| description | text | yes |  |
| status | text | yes | `'ACTIVE'::text` |
| provider | text | yes |  |
| region | text | yes |  |
| tags | ARRAY | no | `ARRAY[]::text[]` |
| logo_url | text | yes |  |
| metadata | jsonb | no | `'{}'::jsonb` |
| visibility | text | no | `'organization'::text` |
| organization_id | uuid | yes |  |
| created_by | uuid | yes |  |
| deleted_at | timestamp with time zone | yes |  |
| updated_at | timestamp with time zone | no | `now()` |

**PK:** id

**Indexes:**
- `CREATE INDEX projects_organization_idx ON public.projects USING btree (organization_id, created_at DESC) WHERE (deleted_at IS NULL)`
- `CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id)`

### `storage.buckets`  ·  4 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | text | no |  |
| name | text | no |  |
| owner | uuid | yes |  |
| created_at | timestamp with time zone | yes | `now()` |
| updated_at | timestamp with time zone | yes | `now()` |
| public | boolean | yes | `false` |
| avif_autodetection | boolean | yes | `false` |
| file_size_limit | bigint | yes |  |
| allowed_mime_types | ARRAY | yes |  |
| owner_id | text | yes |  |
| type | buckettype | no | `'STANDARD'::storage.buckettype` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name)`
- `CREATE UNIQUE INDEX buckets_pkey ON storage.buckets USING btree (id)`

### `storage.buckets_analytics`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| name | text | no |  |
| type | buckettype | no | `'ANALYTICS'::storage.buckettype` |
| format | text | no | `'ICEBERG'::text` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |
| id 🔑 | uuid | no | `gen_random_uuid()` |
| deleted_at | timestamp with time zone | yes |  |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX buckets_analytics_pkey ON storage.buckets_analytics USING btree (id)`
- `CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL)`

### `storage.buckets_vectors`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id | text | no |  |
| type | buckettype | no | `'VECTOR'::storage.buckettype` |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**Indexes:**
- `CREATE UNIQUE INDEX buckets_vectors_pkey ON storage.buckets_vectors USING btree (id)`

### `storage.migrations`  ·  61 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id | integer | no |  |
| name | character varying | no |  |
| hash | character varying | no |  |
| executed_at | timestamp without time zone | yes | `CURRENT_TIMESTAMP` |

**Indexes:**
- `CREATE UNIQUE INDEX migrations_name_key ON storage.migrations USING btree (name)`
- `CREATE UNIQUE INDEX migrations_pkey ON storage.migrations USING btree (id)`

### `storage.objects`  ·  34 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| bucket_id | text | yes |  |
| name | text | yes |  |
| owner | uuid | yes |  |
| created_at | timestamp with time zone | yes | `now()` |
| updated_at | timestamp with time zone | yes | `now()` |
| last_accessed_at | timestamp with time zone | yes | `now()` |
| metadata | jsonb | yes |  |
| path_tokens | ARRAY | yes |  |
| version | text | yes |  |
| owner_id | text | yes |  |
| user_metadata | jsonb | yes |  |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name)`
- `CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C")`
- `CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C")`
- `CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops)`
- `CREATE UNIQUE INDEX objects_pkey ON storage.objects USING btree (id)`

**RLS policies:**
- Office assets are publicly readable (SELECT) roles={public} using=`(bucket_id = 'office-assets'::text)`
- Office assets delete own folder (DELETE) roles={authenticated} using=`((bucket_id = 'office-assets'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid)))`
- Office assets insert own folder (INSERT) roles={authenticated} check=`((bucket_id = 'office-assets'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid)))`
- Office assets update own folder (UPDATE) roles={authenticated} using=`((bucket_id = 'office-assets'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid)))`
- PFP auth delete own folder (DELETE) roles={authenticated} using=`((bucket_id = 'pfp'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid)))`
- PFP auth insert own folder (INSERT) roles={authenticated} check=`((bucket_id = 'pfp'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid)))`
- PFP auth update own folder (UPDATE) roles={authenticated} using=`((bucket_id = 'pfp'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid)))` check=`((bucket_id = 'pfp'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid)))`
- PFP public read (SELECT) roles={public} using=`(bucket_id = 'pfp'::text)`
- Public read access for homeboard (SELECT) roles={public} using=`(bucket_id = 'homeboard'::text)`
- Users can delete own files (DELETE) roles={authenticated} using=`((bucket_id = 'homeboard'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))`
- Users can update own files (UPDATE) roles={authenticated} using=`((bucket_id = 'homeboard'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))` check=`((bucket_id = 'homeboard'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))`
- Users can upload to own folder (INSERT) roles={authenticated} check=`((bucket_id = 'homeboard'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))`

### `storage.s3_multipart_uploads`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | text | no |  |
| in_progress_size | bigint | no | `0` |
| upload_signature | text | no |  |
| bucket_id | text | no |  |
| key | text | no |  |
| version | text | no |  |
| owner_id | text | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| user_metadata | jsonb | yes |  |
| metadata | jsonb | yes |  |

**PK:** id

**Indexes:**
- `CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at)`
- `CREATE UNIQUE INDEX s3_multipart_uploads_pkey ON storage.s3_multipart_uploads USING btree (id)`

### `storage.s3_multipart_uploads_parts`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id 🔑 | uuid | no | `gen_random_uuid()` |
| upload_id | text | no |  |
| size | bigint | no | `0` |
| part_number | integer | no |  |
| bucket_id | text | no |  |
| key | text | no |  |
| etag | text | no |  |
| owner_id | text | yes |  |
| version | text | no |  |
| created_at | timestamp with time zone | no | `now()` |

**PK:** id

**Indexes:**
- `CREATE UNIQUE INDEX s3_multipart_uploads_parts_pkey ON storage.s3_multipart_uploads_parts USING btree (id)`

### `storage.vector_indexes`  ·  0 rows  ·  RLS ON

| column | type | null | default |
|---|---|---|---|
| id | text | no | `gen_random_uuid()` |
| name | text | no |  |
| bucket_id | text | no |  |
| data_type | text | no |  |
| dimension | integer | no |  |
| distance_metric | text | no |  |
| metadata_configuration | jsonb | yes |  |
| created_at | timestamp with time zone | no | `now()` |
| updated_at | timestamp with time zone | no | `now()` |

**Indexes:**
- `CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id)`
- `CREATE UNIQUE INDEX vector_indexes_pkey ON storage.vector_indexes USING btree (id)`

## Enums

- `auth.aal_level`: aal1, aal2, aal3
- `auth.code_challenge_method`: s256, plain
- `auth.factor_status`: unverified, verified
- `auth.factor_type`: totp, webauthn, phone
- `auth.oauth_authorization_status`: pending, approved, denied, expired
- `auth.oauth_client_type`: public, confidential
- `auth.oauth_registration_type`: dynamic, manual
- `auth.oauth_response_type`: code
- `auth.one_time_token_type`: confirmation_token, reauthentication_token, recovery_token, email_change_token_new, email_change_token_current, phone_change_token
- `public.Role`: Owner, Manager, User, Leader, Technical Officer, Financial Officer
- `storage.buckettype`: STANDARD, ANALYTICS, VECTOR

## Functions

- `auth.email()`
- `auth.jwt()`
- `auth.role()`
- `auth.uid()`
- `email.set_updated_at()`
- `flow.can_access_issue_project(target_project_id uuid)`
- `flow.can_access_project(target_project_id uuid)`
- `flow.has_ability(target_project_id uuid, ability text)`
- `flow.is_org_member(target_org uuid)`
- `flow.project_org(target_project_id uuid)`
- `flow.project_role(target_project_id uuid)`
- `flow.set_updated_at()`
- `public._lt_q_regex(ltree[], lquery[])`
- `public._lt_q_rregex(lquery[], ltree[])`
- `public._ltq_extract_regex(ltree[], lquery)`
- `public._ltq_regex(ltree[], lquery)`
- `public._ltq_rregex(lquery, ltree[])`
- `public._ltree_compress(internal)`
- `public._ltree_consistent(internal, ltree[], smallint, oid, internal)`
- `public._ltree_extract_isparent(ltree[], ltree)`
- `public._ltree_extract_risparent(ltree[], ltree)`
- `public._ltree_gist_options(internal)`
- `public._ltree_isparent(ltree[], ltree)`
- `public._ltree_penalty(internal, internal, internal)`
- `public._ltree_picksplit(internal, internal)`
- `public._ltree_r_isparent(ltree, ltree[])`
- `public._ltree_r_risparent(ltree, ltree[])`
- `public._ltree_risparent(ltree[], ltree)`
- `public._ltree_same(ltree_gist, ltree_gist, internal)`
- `public._ltree_union(internal, internal)`
- `public._ltxtq_exec(ltree[], ltxtquery)`
- `public._ltxtq_extract_exec(ltree[], ltxtquery)`
- `public._ltxtq_rexec(ltxtquery, ltree[])`
- `public.can_edit_file(f_id uuid)`
- `public.can_view_file(f_id uuid)`
- `public.cash_dist(money, money)`
- `public.citext(character)`
- `public.citext(boolean)`
- `public.citext(inet)`
- `public.citext_cmp(citext, citext)`
- `public.citext_eq(citext, citext)`
- `public.citext_ge(citext, citext)`
- `public.citext_gt(citext, citext)`
- `public.citext_hash(citext)`
- `public.citext_hash_extended(citext, bigint)`
- `public.citext_larger(citext, citext)`
- `public.citext_le(citext, citext)`
- `public.citext_lt(citext, citext)`
- `public.citext_ne(citext, citext)`
- `public.citext_pattern_cmp(citext, citext)`
- `public.citext_pattern_ge(citext, citext)`
- `public.citext_pattern_gt(citext, citext)`
- `public.citext_pattern_le(citext, citext)`
- `public.citext_pattern_lt(citext, citext)`
- `public.citext_smaller(citext, citext)`
- `public.citextin(cstring)`
- `public.citextout(citext)`
- `public.citextrecv(internal)`
- `public.citextsend(citext)`
- `public.date_dist(date, date)`
- `public.float4_dist(real, real)`
- `public.float8_dist(double precision, double precision)`
- `public.flow_can_access_project(target_project uuid)`
- `public.flow_can_edit_project(target_project_id uuid)`
- `public.flow_can_view_project(target_project_id uuid)`
- `public.flow_create_task(p_project_id uuid, p_title text, p_description text DEFAULT NULL::text, p_status text DEFAULT 'todo'::text, p_priority text DEFAULT 'medium'::text, p_stage text DEFAULT 'backlog'::text, p_type text DEFAULT 'task'::text, p_progress numeric DEFAULT 0, p_labels text[] DEFAULT ARRAY[]::text[], p_assignee_ids uuid[] DEFAULT ARRAY[]::uuid[], p_parent_link text DEFAULT NULL::text, p_start_date date DEFAULT NULL::date, p_due_date date DEFAULT NULL::date, p_deadline_tracking text DEFAULT 'not_set'::text, p_git_branch text DEFAULT NULL::text, p_reminders jsonb DEFAULT '[]'::jsonb, p_role_visibility text DEFAULT 'team'::text, p_latest_update text DEFAULT NULL::text)`
- `public.flow_current_org()`
- `public.flow_delete_task(p_task_id uuid)`
- `public.flow_ensure_user_organization()`
- `public.flow_is_org_member(target_organization_id uuid)`
- `public.flow_set_updated_at()`
- `public.flow_slugify(value text)`
- `public.flow_sync_notification_timestamps()`
- `public.flow_update_task(p_task_id uuid, p_title text DEFAULT NULL::text, p_description text DEFAULT NULL::text, p_status text DEFAULT NULL::text, p_priority text DEFAULT NULL::text, p_stage text DEFAULT NULL::text, p_type text DEFAULT NULL::text, p_progress numeric DEFAULT NULL::numeric, p_labels text[] DEFAULT NULL::text[], p_assignee_ids uuid[] DEFAULT NULL::uuid[], p_parent_link text DEFAULT NULL::text, p_start_date date DEFAULT NULL::date, p_due_date date DEFAULT NULL::date, p_deadline_tracking text DEFAULT NULL::text, p_git_branch text DEFAULT NULL::text, p_reminders jsonb DEFAULT NULL::jsonb, p_role_visibility text DEFAULT NULL::text, p_latest_update text DEFAULT NULL::text)`
- `public.gbt_bit_compress(internal)`
- `public.gbt_bit_consistent(internal, bit, smallint, oid, internal)`
- `public.gbt_bit_penalty(internal, internal, internal)`
- `public.gbt_bit_picksplit(internal, internal)`
- `public.gbt_bit_same(gbtreekey_var, gbtreekey_var, internal)`
- `public.gbt_bit_union(internal, internal)`
- `public.gbt_bool_compress(internal)`
- `public.gbt_bool_consistent(internal, boolean, smallint, oid, internal)`
- `public.gbt_bool_fetch(internal)`
- `public.gbt_bool_penalty(internal, internal, internal)`
- `public.gbt_bool_picksplit(internal, internal)`
- `public.gbt_bool_same(gbtreekey2, gbtreekey2, internal)`
- `public.gbt_bool_union(internal, internal)`
- `public.gbt_bpchar_compress(internal)`
- `public.gbt_bpchar_consistent(internal, character, smallint, oid, internal)`
- `public.gbt_bytea_compress(internal)`
- `public.gbt_bytea_consistent(internal, bytea, smallint, oid, internal)`
- `public.gbt_bytea_penalty(internal, internal, internal)`
- `public.gbt_bytea_picksplit(internal, internal)`
- `public.gbt_bytea_same(gbtreekey_var, gbtreekey_var, internal)`
- `public.gbt_bytea_union(internal, internal)`
- `public.gbt_cash_compress(internal)`
- `public.gbt_cash_consistent(internal, money, smallint, oid, internal)`
- `public.gbt_cash_distance(internal, money, smallint, oid, internal)`
- `public.gbt_cash_fetch(internal)`
- `public.gbt_cash_penalty(internal, internal, internal)`
- `public.gbt_cash_picksplit(internal, internal)`
- `public.gbt_cash_same(gbtreekey16, gbtreekey16, internal)`
- `public.gbt_cash_union(internal, internal)`
- `public.gbt_date_compress(internal)`
- `public.gbt_date_consistent(internal, date, smallint, oid, internal)`
- `public.gbt_date_distance(internal, date, smallint, oid, internal)`
- `public.gbt_date_fetch(internal)`
- `public.gbt_date_penalty(internal, internal, internal)`
- `public.gbt_date_picksplit(internal, internal)`
- `public.gbt_date_same(gbtreekey8, gbtreekey8, internal)`
- `public.gbt_date_union(internal, internal)`
- `public.gbt_decompress(internal)`
- `public.gbt_enum_compress(internal)`
- `public.gbt_enum_consistent(internal, anyenum, smallint, oid, internal)`
- `public.gbt_enum_fetch(internal)`
- `public.gbt_enum_penalty(internal, internal, internal)`
- `public.gbt_enum_picksplit(internal, internal)`
- `public.gbt_enum_same(gbtreekey8, gbtreekey8, internal)`
- `public.gbt_enum_union(internal, internal)`
- `public.gbt_float4_compress(internal)`
- `public.gbt_float4_consistent(internal, real, smallint, oid, internal)`
- `public.gbt_float4_distance(internal, real, smallint, oid, internal)`
- `public.gbt_float4_fetch(internal)`
- `public.gbt_float4_penalty(internal, internal, internal)`
- `public.gbt_float4_picksplit(internal, internal)`
- `public.gbt_float4_same(gbtreekey8, gbtreekey8, internal)`
- `public.gbt_float4_union(internal, internal)`
- `public.gbt_float8_compress(internal)`
- `public.gbt_float8_consistent(internal, double precision, smallint, oid, internal)`
- `public.gbt_float8_distance(internal, double precision, smallint, oid, internal)`
- `public.gbt_float8_fetch(internal)`
- `public.gbt_float8_penalty(internal, internal, internal)`
- `public.gbt_float8_picksplit(internal, internal)`
- `public.gbt_float8_same(gbtreekey16, gbtreekey16, internal)`
- `public.gbt_float8_union(internal, internal)`
- `public.gbt_inet_compress(internal)`
- `public.gbt_inet_consistent(internal, inet, smallint, oid, internal)`
- `public.gbt_inet_penalty(internal, internal, internal)`
- `public.gbt_inet_picksplit(internal, internal)`
- `public.gbt_inet_same(gbtreekey16, gbtreekey16, internal)`
- `public.gbt_inet_union(internal, internal)`
- `public.gbt_int2_compress(internal)`
- `public.gbt_int2_consistent(internal, smallint, smallint, oid, internal)`
- `public.gbt_int2_distance(internal, smallint, smallint, oid, internal)`
- `public.gbt_int2_fetch(internal)`
- `public.gbt_int2_penalty(internal, internal, internal)`
- `public.gbt_int2_picksplit(internal, internal)`
- `public.gbt_int2_same(gbtreekey4, gbtreekey4, internal)`
- `public.gbt_int2_union(internal, internal)`
- `public.gbt_int4_compress(internal)`
- `public.gbt_int4_consistent(internal, integer, smallint, oid, internal)`
- `public.gbt_int4_distance(internal, integer, smallint, oid, internal)`
- `public.gbt_int4_fetch(internal)`
- `public.gbt_int4_penalty(internal, internal, internal)`
- `public.gbt_int4_picksplit(internal, internal)`
- `public.gbt_int4_same(gbtreekey8, gbtreekey8, internal)`
- `public.gbt_int4_union(internal, internal)`
- `public.gbt_int8_compress(internal)`
- `public.gbt_int8_consistent(internal, bigint, smallint, oid, internal)`
- `public.gbt_int8_distance(internal, bigint, smallint, oid, internal)`
- `public.gbt_int8_fetch(internal)`
- `public.gbt_int8_penalty(internal, internal, internal)`
- `public.gbt_int8_picksplit(internal, internal)`
- `public.gbt_int8_same(gbtreekey16, gbtreekey16, internal)`
- `public.gbt_int8_union(internal, internal)`
- `public.gbt_intv_compress(internal)`
- `public.gbt_intv_consistent(internal, interval, smallint, oid, internal)`
- `public.gbt_intv_decompress(internal)`
- `public.gbt_intv_distance(internal, interval, smallint, oid, internal)`
- `public.gbt_intv_fetch(internal)`
- `public.gbt_intv_penalty(internal, internal, internal)`
- `public.gbt_intv_picksplit(internal, internal)`
- `public.gbt_intv_same(gbtreekey32, gbtreekey32, internal)`
- `public.gbt_intv_union(internal, internal)`
- `public.gbt_macad8_compress(internal)`
- `public.gbt_macad8_consistent(internal, macaddr8, smallint, oid, internal)`
- `public.gbt_macad8_fetch(internal)`
- `public.gbt_macad8_penalty(internal, internal, internal)`
- `public.gbt_macad8_picksplit(internal, internal)`
- `public.gbt_macad8_same(gbtreekey16, gbtreekey16, internal)`
- `public.gbt_macad8_union(internal, internal)`
- `public.gbt_macad_compress(internal)`
- `public.gbt_macad_consistent(internal, macaddr, smallint, oid, internal)`
- `public.gbt_macad_fetch(internal)`
- `public.gbt_macad_penalty(internal, internal, internal)`
- `public.gbt_macad_picksplit(internal, internal)`
- `public.gbt_macad_same(gbtreekey16, gbtreekey16, internal)`
- `public.gbt_macad_union(internal, internal)`
- `public.gbt_numeric_compress(internal)`
- `public.gbt_numeric_consistent(internal, numeric, smallint, oid, internal)`
- `public.gbt_numeric_penalty(internal, internal, internal)`
- `public.gbt_numeric_picksplit(internal, internal)`
- `public.gbt_numeric_same(gbtreekey_var, gbtreekey_var, internal)`
- `public.gbt_numeric_union(internal, internal)`
- `public.gbt_oid_compress(internal)`
- `public.gbt_oid_consistent(internal, oid, smallint, oid, internal)`
- `public.gbt_oid_distance(internal, oid, smallint, oid, internal)`
- `public.gbt_oid_fetch(internal)`
- `public.gbt_oid_penalty(internal, internal, internal)`
- `public.gbt_oid_picksplit(internal, internal)`
- `public.gbt_oid_same(gbtreekey8, gbtreekey8, internal)`
- `public.gbt_oid_union(internal, internal)`
- `public.gbt_text_compress(internal)`
- `public.gbt_text_consistent(internal, text, smallint, oid, internal)`
- `public.gbt_text_penalty(internal, internal, internal)`
- `public.gbt_text_picksplit(internal, internal)`
- `public.gbt_text_same(gbtreekey_var, gbtreekey_var, internal)`
- `public.gbt_text_union(internal, internal)`
- `public.gbt_time_compress(internal)`
- `public.gbt_time_consistent(internal, time without time zone, smallint, oid, internal)`
- `public.gbt_time_distance(internal, time without time zone, smallint, oid, internal)`
- `public.gbt_time_fetch(internal)`
- `public.gbt_time_penalty(internal, internal, internal)`
- `public.gbt_time_picksplit(internal, internal)`
- `public.gbt_time_same(gbtreekey16, gbtreekey16, internal)`
- `public.gbt_time_union(internal, internal)`
- `public.gbt_timetz_compress(internal)`
- `public.gbt_timetz_consistent(internal, time with time zone, smallint, oid, internal)`
- `public.gbt_ts_compress(internal)`
- `public.gbt_ts_consistent(internal, timestamp without time zone, smallint, oid, internal)`
- `public.gbt_ts_distance(internal, timestamp without time zone, smallint, oid, internal)`
- `public.gbt_ts_fetch(internal)`
- `public.gbt_ts_penalty(internal, internal, internal)`
- `public.gbt_ts_picksplit(internal, internal)`
- `public.gbt_ts_same(gbtreekey16, gbtreekey16, internal)`
- `public.gbt_ts_union(internal, internal)`
- `public.gbt_tstz_compress(internal)`
- `public.gbt_tstz_consistent(internal, timestamp with time zone, smallint, oid, internal)`
- `public.gbt_tstz_distance(internal, timestamp with time zone, smallint, oid, internal)`
- `public.gbt_uuid_compress(internal)`
- `public.gbt_uuid_consistent(internal, uuid, smallint, oid, internal)`
- `public.gbt_uuid_fetch(internal)`
- `public.gbt_uuid_penalty(internal, internal, internal)`
- `public.gbt_uuid_picksplit(internal, internal)`
- `public.gbt_uuid_same(gbtreekey32, gbtreekey32, internal)`
- `public.gbt_uuid_union(internal, internal)`
- `public.gbt_var_decompress(internal)`
- `public.gbt_var_fetch(internal)`
- `public.gbtreekey16_in(cstring)`
- `public.gbtreekey16_out(gbtreekey16)`
- `public.gbtreekey2_in(cstring)`
- `public.gbtreekey2_out(gbtreekey2)`
- `public.gbtreekey32_in(cstring)`
- `public.gbtreekey32_out(gbtreekey32)`
- `public.gbtreekey4_in(cstring)`
- `public.gbtreekey4_out(gbtreekey4)`
- `public.gbtreekey8_in(cstring)`
- `public.gbtreekey8_out(gbtreekey8)`
- `public.gbtreekey_var_in(cstring)`
- `public.gbtreekey_var_out(gbtreekey_var)`
- `public.geiger_forms_sync_response_count()`
- `public.geiger_forms_touch_updated_at()`
- `public.generate_room_code()`
- `public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal)`
- `public.gin_extract_value_trgm(text, internal)`
- `public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal)`
- `public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal)`
- `public.gtrgm_compress(internal)`
- `public.gtrgm_consistent(internal, text, smallint, oid, internal)`
- `public.gtrgm_decompress(internal)`
- `public.gtrgm_distance(internal, text, smallint, oid, internal)`
- `public.gtrgm_in(cstring)`
- `public.gtrgm_options(internal)`
- `public.gtrgm_out(gtrgm)`
- `public.gtrgm_penalty(internal, internal, internal)`
- `public.gtrgm_picksplit(internal, internal)`
- `public.gtrgm_same(gtrgm, gtrgm, internal)`
- `public.gtrgm_union(internal, internal)`
- `public.hash_ltree(ltree)`
- `public.hash_ltree_extended(ltree, bigint)`
- `public.index(ltree, ltree)`
- `public.index(ltree, ltree, integer)`
- `public.int2_dist(smallint, smallint)`
- `public.int4_dist(integer, integer)`
- `public.int8_dist(bigint, bigint)`
- `public.interval_dist(interval, interval)`
- `public.lca(ltree, ltree, ltree, ltree, ltree, ltree, ltree, ltree)`
- `public.lca(ltree[])`
- `public.lca(ltree, ltree)`
- `public.lca(ltree, ltree, ltree)`
- `public.lca(ltree, ltree, ltree, ltree)`
- `public.lca(ltree, ltree, ltree, ltree, ltree)`
- `public.lca(ltree, ltree, ltree, ltree, ltree, ltree)`
- `public.lca(ltree, ltree, ltree, ltree, ltree, ltree, ltree)`
- `public.lquery_in(cstring)`
- `public.lquery_out(lquery)`
- `public.lquery_recv(internal)`
- `public.lquery_send(lquery)`
- `public.lt_q_regex(ltree, lquery[])`
- `public.lt_q_rregex(lquery[], ltree)`
- `public.ltq_regex(ltree, lquery)`
- `public.ltq_rregex(lquery, ltree)`
- `public.ltree2text(ltree)`
- `public.ltree_addltree(ltree, ltree)`
- `public.ltree_addtext(ltree, text)`
- `public.ltree_cmp(ltree, ltree)`
- `public.ltree_compress(internal)`
- `public.ltree_consistent(internal, ltree, smallint, oid, internal)`
- `public.ltree_decompress(internal)`
- `public.ltree_eq(ltree, ltree)`
- `public.ltree_ge(ltree, ltree)`
- `public.ltree_gist_in(cstring)`
- `public.ltree_gist_options(internal)`
- `public.ltree_gist_out(ltree_gist)`
- `public.ltree_gt(ltree, ltree)`
- `public.ltree_in(cstring)`
- `public.ltree_isparent(ltree, ltree)`
- `public.ltree_le(ltree, ltree)`
- `public.ltree_lt(ltree, ltree)`
- `public.ltree_ne(ltree, ltree)`
- `public.ltree_out(ltree)`
- `public.ltree_penalty(internal, internal, internal)`
- `public.ltree_picksplit(internal, internal)`
- `public.ltree_recv(internal)`
- `public.ltree_risparent(ltree, ltree)`
- `public.ltree_same(ltree_gist, ltree_gist, internal)`
- `public.ltree_send(ltree)`
- `public.ltree_textadd(text, ltree)`
- `public.ltree_union(internal, internal)`
- `public.ltreeparentsel(internal, oid, internal, integer)`
- `public.ltxtq_exec(ltree, ltxtquery)`
- `public.ltxtq_in(cstring)`
- `public.ltxtq_out(ltxtquery)`
- `public.ltxtq_recv(internal)`
- `public.ltxtq_rexec(ltxtquery, ltree)`
- `public.ltxtq_send(ltxtquery)`
- `public.max(citext)`
- `public.min(citext)`
- `public.nlevel(ltree)`
- `public.office_file_role(f_id uuid)`
- `public.oid_dist(oid, oid)`
- `public.regexp_match(citext, citext)`
- `public.regexp_match(citext, citext, text)`
- `public.regexp_matches(citext, citext)`
- `public.regexp_matches(citext, citext, text)`
- `public.regexp_replace(citext, citext, text)`
- `public.regexp_replace(citext, citext, text, text)`
- `public.regexp_split_to_array(citext, citext)`
- `public.regexp_split_to_array(citext, citext, text)`
- `public.regexp_split_to_table(citext, citext)`
- `public.regexp_split_to_table(citext, citext, text)`
- `public.replace(citext, citext, citext)`
- `public.request_join_session(room_code text, user_id uuid)`
- `public.set_limit(real)`
- `public.show_limit()`
- `public.show_trgm(text)`
- `public.similarity(text, text)`
- `public.similarity_dist(text, text)`
- `public.similarity_op(text, text)`
- `public.split_part(citext, citext, integer)`
- `public.strict_word_similarity(text, text)`
- `public.strict_word_similarity_commutator_op(text, text)`
- `public.strict_word_similarity_dist_commutator_op(text, text)`
- `public.strict_word_similarity_dist_op(text, text)`
- `public.strict_word_similarity_op(text, text)`
- `public.strpos(citext, citext)`
- `public.subltree(ltree, integer, integer)`
- `public.subpath(ltree, integer)`
- `public.subpath(ltree, integer, integer)`
- `public.text2ltree(text)`
- `public.texticlike(citext, citext)`
- `public.texticlike(citext, text)`
- `public.texticnlike(citext, citext)`
- `public.texticnlike(citext, text)`
- `public.texticregexeq(citext, citext)`
- `public.texticregexeq(citext, text)`
- `public.texticregexne(citext, citext)`
- `public.texticregexne(citext, text)`
- `public.time_dist(time without time zone, time without time zone)`
- `public.translate(citext, citext, text)`
- `public.ts_dist(timestamp without time zone, timestamp without time zone)`
- `public.tstz_dist(timestamp with time zone, timestamp with time zone)`
- `public.update_canvas_boards_updated_at()`
- `public.update_office_files_updated_at()`
- `public.update_office_folders_updated_at()`
- `public.update_updated_at_column()`
- `public.word_similarity(text, text)`
- `public.word_similarity_commutator_op(text, text)`
- `public.word_similarity_dist_commutator_op(text, text)`
- `public.word_similarity_dist_op(text, text)`
- `public.word_similarity_op(text, text)`
- `storage.allow_any_operation(expected_operations text[])`
- `storage.allow_only_operation(expected_operation text)`
- `storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb)`
- `storage.enforce_bucket_name_length()`
- `storage.extension(name text)`
- `storage.filename(name text)`
- `storage.foldername(name text)`
- `storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text)`
- `storage.get_size_by_bucket()`
- `storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text)`
- `storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text)`
- `storage.operation()`
- `storage.protect_delete()`
- `storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text)`
- `storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text)`
- `storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text)`
- `storage.update_updated_at_column()`
