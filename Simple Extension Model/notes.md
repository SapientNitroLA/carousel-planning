# Design

XJS

- Provides tools to ComponentJS and FeatureJS for inter/cross-communication
- Provides tools to FeatureJS to "plugin" to ComponentJS
- Provides tools to FeatureJS to extend ComponentJS's public-facing API


ComponentJS

- Depends on XJS
- Provides core features


FeatureJS

- Depends on ComponentJS
- Provides features to ComponentJS
- Can extend ComponentJS's public-facing API