# CV source

LaTeX source for the resume linked on the site.

## Build

```bash
cd cv
latexmk -pdf CV_Ibrahim_Khadraoui.tex
```

## Publish

Copy the fresh build over the served copy:

```bash
cp cv/CV_Ibrahim_Khadraoui.pdf public/CV_Ibrahim_Khadraoui.pdf
```

The site links `/CV_Ibrahim_Khadraoui.pdf` from the Experience page.

Build artifacts (`.aux`, `.log`, the local `.pdf`, …) are gitignored — only
the `.tex` and this README are tracked. Several `TODO_LINK_*` placeholders
remain in the source; grep for them before sending the CV out.
