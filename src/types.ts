interface CustomFeatureProperties {
	ROW: string;
	PATH: string;
	cid: string;
	datetime: string; // Expected in ISO format, e.g., '2023-08-12T14:30:00Z'
	s3: string;
	// IPFS_NODES: number;
	// FIL_DEALS: number;
	// ON_S3: boolean;
}

export interface Web3EnrichedMapboxFeature extends mapboxgl.MapboxGeoJSONFeature {
	properties: CustomFeatureProperties;
}

export interface metadata {
	ipfs: number;
	filecoin: number;
	unsealed: number;
}
