# Personal academic website

A professional, responsive academic website designed for GitHub Pages. Its page structure follows the reference pattern at `xiao-ma.me`: About, Book, Papers, Data, Teaching, CV, and Contact.

## Edit content with Markdown

You do not need to edit the webpage code for ordinary updates. All editable content lives in `content/`:

| File | Controls |
| --- | --- |
| `content/site.md` | Name, title, affiliation, location, email, office, CV link, and profile links |
| `content/about.md` | Front-page biography and research overview |
| `content/book.md` | Book or major project page |
| `content/papers.md` | Publications and working papers |
| `content/data.md` | Datasets and research resources |
| `content/teaching.md` | Teaching interests and courses |
| `content/cv.md` | Optional CV-page introduction |
| `content/contact.md` | Additional contact text |

Each page file has a small front-matter block between `---` lines and a commented example. Replace the comment with your own Markdown. All personal values are intentionally blank.

- Replace `public/profile.jpg` to update the front-page portrait.
- Replace `public/cv.pdf` to update the bundled CV fallback.
- Paste an anyone-with-the-link Dropbox URL into `dropbox_cv_url` in `content/site.md` to make both CV buttons use Dropbox.

## Publish on GitHub Pages

1. Create a GitHub repository and push this folder to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. The included workflow builds and publishes the site automatically on every push to `main`.

Both user sites (`username.github.io`) and project sites (`username.github.io/repository`) are supported.
