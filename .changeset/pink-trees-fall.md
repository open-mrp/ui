---
"@augno/ui": patch
---

changed how the DocHeading component parced its `children` input so that it could display a wider range of inputs and still properly function. This was done with the TableHeading component in mind from the augno internal docs. the TableHeading passed a react component for tooltips and some strings
