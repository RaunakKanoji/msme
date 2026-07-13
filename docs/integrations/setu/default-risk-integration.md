# Default-risk integration

Only versioned derived features are sent to the model service. Raw statements are excluded by default. Predictions must return probability, configurable risk band, model version, data quality, and positive/negative explanations. No mock prediction is used in Setu or production mode; rules-based health metrics are the fallback.
