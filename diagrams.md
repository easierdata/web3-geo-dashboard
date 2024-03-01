## Sequence of events that that take place when a user interacts with the map

```mermaid
sequenceDiagram
    participant User
    participant onMount Function
    participant Map
    participant handleClick Function
    participant createPopupContent Function
    participant Anonymous Function
    onMount Function->>Map: Initializes Map and sets up event handlers
    User->>Map: Clicks on 'LANDSAT_SCENE_OUTLINES-layer'
    Map->>handleClick Function: Triggers handleClick(e)
    handleClick Function->>createPopupContent Function: Calls createPopupContent(feature)
    createPopupContent Function-->>handleClick Function: Returns popup content
    handleClick Function-->>Map: Updates state or interacts with system
    User->>Map: Closes Popup
    Map->>Anonymous Function: Triggers 'close' event
    Anonymous Function->>Map: Sets filter on 'LANDSAT_SCENE_OUTLINES-highlighted'
    Map-->>User: Reflects changes (if any)
```

## Flow chart of the different ways a user can interact with features on the map

```mermaid
graph LR
    A[User interacts with map] --> B{Event type}
    B -->|"click on feature"| C[Call handleClick function]
    C--> D["filter 'LANDSAT_SCENE_OUTLINES-highlighted' layer" to selected feature]
    D --> E[Call createPopupContent function]
    E -->|User closes popup| F[Remove 'LANDSAT_SCENE_OUTLINES-highlighted' layer filter]
    F --> G[Reset selectedFeatures and cidArray constants]
    B -->|Select Multiple features| H["filter 'LANDSAT_SCENE_OUTLINES-highlighted' layer" to selected features]
    H --> I{Check if key pressed is 'Escape'}
    I -->|Yes| F
    G --> K[User ends interaction]
    I -->|No| K
```

## Sequence of events to create pop-up when a user clicks on a grid.

```mermaid
sequenceDiagram
    participant handleClick Event
    participant createPopupContent Function
    participant getPopupMetadata Function
    participant API
    handleClick Event->>createPopupContent Function: Ask for popup
    createPopupContent Function->>getPopupMetadata Function: Calls getPopupMetadata(properties.cid)
    getPopupMetadata Function->>API: Sends GET request to API
    API-->>getPopupMetadata Function: Returns response
    getPopupMetadata Function-->>createPopupContent Function: Returns metadata
    createPopupContent Function-->>handleClick Event: Constructs Popup with metadata
```

## Flowchart of a the API Request to fetch the metadata for a selected CID: getPopupMetadata Function

```mermaid
graph LR
    A[Start] --> B{Send GET request to API}
    B -->|Response OK| C[Parse JSON and return data]
    B -->|Response not OK| D[Throw error and return undefined]
    C --> E[End]
    D --> E
```

## Flowchart of the steps to build `<div>` element for the modal

```mermaid
graph LR
    A[Start] --> B{Check if selectedFeatures.length > 0}
    B -->|Yes| C[Create side-container div]
    B -->|No| D[End]
    C --> E[Create Accordion component]
    E --> F[Display number of selected features]
    F --> G[Sort selectedFeatures by datetime]
    G --> H[For each feature, create a paragraph and a div]
    H --> I[Create a link to the feature]
    I --> J[Display the feature's filename]
    J --> K[Create an image with a link to the feature's reflective Landsat image]
    K --> L[Display code snippets]
    L --> M[End]

```
