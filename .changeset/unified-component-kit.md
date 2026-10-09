---
'@openmrp/ui': major
---

Unified component kit: the full set of OpenMRP dashboard components now lives in this package.

New components: `ButtonBase`, `IconButton`, `Fab`, `ToggleButton`, `CircularProgress`, `LinearProgress`, `Snackbar`, `Paper`, `Container`, `Grid`, `Stack`, `Divider`, `List`, `Modal`, `Drawer`, `Menu`, `Popper`, `ClickAwayListener`, `TextField`, `InputBase`, `FormControl`, `Select` (with built-in search and chip multi-select), `Autocomplete`, `Slider`, `TextareaAutosize`, `Link`, `Avatar`, `Badge`, `Typography`, `SvgIcon`, theme helpers (`useAppTheme`, `useColorScheme`, palette tokens) and responsive hooks (`useMediaQuery`, `useBreakpointUp`, `useBreakpointDown`). `styles.css` now ships the palette, elevation, motion and breakpoint tokens these components use, with light and dark values switched by the `.dark` class.

Breaking changes:

- `Button`: `variant` is `contained | outlined | text`; `color` is a palette name (`primary`, `secondary`, `error`, `warning`, `info`, `success`, `inherit`); `size` is `small | medium | large`. Use `IconButton` instead of `variant="icon"`. Adds `startIcon`, `endIcon`, `loading`, `fullWidth`. `Button` is now a named export only. The previous button, with any CSS `color`, `variant="icon"` and `blur`, is available unchanged as `GlassButton` for marketing and docs surfaces; `DarkModeButton`, `DropdownMenuButton` and the flowchart controls keep using it.
- `Card`: parts are `CardHeader` (with `title`, `subheader`, `avatar`, `action`), `CardContent`/`CardBody`, `CardActions`/`CardFooter`, `CardTitle`, `CardDescription`.
- `Alert`: severity moves from `variant` to `severity`; `variant` is now `standard | outlined | filled`. Adds `onClose`, `action`, `AlertTitle`.
- `Skeleton`: variants are `text | rectangular | rounded | circular`; adds `width`, `height`, `animation`.
- `Dialog`: controlled with `open` and `onClose`; parts are `DialogTitle`, `DialogContent`, `DialogActions`, `DialogContentText`. Sized with `maxWidth`, `fullWidth`, `fullScreen`. `DialogTrigger`, `DialogClose`, `DialogHeader`, `DialogBody`, `DialogFooter` and `DialogDescription` were removed.
- `Tooltip`: a single wrapper with `title` and `placement`. `TooltipTrigger`, `TooltipContent` and `TooltipProvider` were removed.
- `Popover`: anchored with `anchorEl`, `open` and `onClose`. `PopoverTrigger`, `PopoverContent` and `PopoverAnchor` were removed.
- `Tabs`: controlled with `value` and `onChange`, with `Tab` children. `TabsList`, `TabsTrigger` and `TabsContent` were removed.
- `Checkbox`, `Radio`, `RadioGroup`, `Switch`: `onChange(event, checked)` replaces `onCheckedChange`/`onValueChange`; labels come from `FormControlLabel`.
- `Input` and `Textarea` were replaced by `TextField` (use `multiline` for text areas); `Input` is now the unstyled-underline input primitive.
- `Chip`: takes `label`, `color`, `variant`, `size` (`small | medium`) and `onDelete`.
- Tables: `TableHead` is the header section (`<thead>`) and header cells are `TableCell`; `TableHeader` and `TableCaption` were removed. `TablePagination` is the new page/rows-per-page control.
- `Stepper` and `Breadcrumbs` use the `Step`/`StepLabel` and children-based APIs.
- `cn` merges the kit's custom shadow and text tokens correctly.
