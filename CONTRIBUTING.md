<h1 align="center">🤝 Contributing to Anchorr</h1>

<p align="center">
  Thank you for considering contributing to Anchorr! We appreciate all kinds of contributions, from bug reports to new features.
</p>

## 🎯 Ways to Contribute

### 🐛 Report Bugs

Found a bug? Please help us fix it!

**When reporting, include:**

- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Console logs/error messages
- Your environment (Node.js version, OS, etc.)
- Screenshots if applicable

[Open a bug report](https://github.com/nairdahh/anchorr/issues/new?labels=bug&template=bug_report.md)

### 💡 Suggest Features

Have an idea to improve Anchorr?

**Before submitting:**

- Check existing issues to avoid duplicates
- Provide a clear use case
- Explain the expected behavior
- Discuss the implementation approach

[Suggest a feature](https://github.com/nairdahh/anchorr/issues/new?labels=enhancement&template=feature_request.md)

### 📝 Improve Documentation

Help us improve README, guides, or inline code comments!

### 🔧 Submit Code Changes

We love pull requests! Here's how to submit one:

#### Step 1: Fork & Setup

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR-USERNAME/anchorr.git
cd anchorr
npm install
```

#### Step 2: Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for bugfixes:
git checkout -b fix/bug-description
```

#### Step 3: Make Changes & Commit

```bash
git add .
git commit -m "feat: add awesome feature"
# Use conventional commits:
# feat: new feature
# fix: bug fix
# docs: documentation
# style: formatting changes
# refactor: code refactoring
# test: adding tests
```

#### Step 4: Push & Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then [open a PR](https://github.com/nairdahh/anchorr/compare) against the `main` branch.

#### PR Guidelines

- ✅ Keep PRs focused on a single feature/fix
- ✅ Write clear commit messages
- ✅ Update README if adding new features
- ✅ Test locally before submitting
- ✅ Link related issues

## 🌍 Adding New Languages

Want to add your language to Anchorr? It's easy and we welcome all translations!

### Getting Started

1. **Copy the template**: Start with `locales/template.json` as your base
2. **Rename the file**: Save it as `[language_code].json` (e.g., `fr.json` for French, `es.json` for Spanish)
3. **Update the metadata**: Fill in the `_meta` section with your language information
4. **Translate the strings**: Replace all empty strings with translations in your target language

### File Structure

```
locales/
├── en.json          # English (reference)
├── de.json          # German (example)
├── template.json    # Template for new languages
└── [your-lang].json # Your translation
```

### Translation Template

The template is organized into logical sections:

#### Metadata (`_meta`)
Contains information about the translation:
- `language_name`: The native name of your language (e.g., "Français", "Español")
- `language_code`: ISO 639-1 language code (e.g., "fr", "es")
- `contributors`: List of people who worked on this translation
- `completion`: Percentage of completion (update as you translate)
- `last_updated`: Date of last update
- `notes`: Any special notes about the translation

#### Translation Sections

1. **`common`**: Basic UI elements (buttons, labels, common actions)
2. **`auth`**: Login/registration forms
3. **`navigation`**: Menu items and navigation
4. **`dashboard`**: Main dashboard content
5. **`config`**: Configuration form labels and help texts
6. **`bot`**: Discord bot status and controls
7. **`logs`**: Log viewer interface
8. **`notifications`**: Discord notification templates
9. **`errors`**: Error messages
10. **`about`**: About page content

### Translation Guidelines

#### 1. Context Matters
- Look at the English (`en.json`) and German (`de.json`) files for context
- Consider where the text will appear in the UI
- Some strings are used in buttons, others in help text

#### 2. Placeholders and Variables
- Some strings may contain placeholders like `{{variable}}`
- Keep these placeholders exactly as they are
- Example: `"Welcome {{username}}"` → `"Bienvenido {{username}}"`

#### 3. Consistency
- Use consistent terminology throughout the translation
- Keep the tone appropriate for a technical application
- Maintain consistent capitalization patterns for your language

#### 4. Help Text
- Help text (strings ending with `_help`) should be informative but concise
- They appear as small descriptions under form fields

#### 5. Length Considerations
- Button text should be reasonably short
- Consider UI space constraints when translating

### Testing Your Translation

1. **Add your language to the selector**: Edit `app.js` in the languages endpoint to include your language:
   ```javascript
   const languages = i18n.getAvailableLanguages().map(lang => ({
     code: lang,
     name: lang === 'en' ? 'English' : 
           lang === 'de' ? 'Deutsch' : 
           lang === 'fr' ? 'Français' :  // Add your language here
           lang
   }));
   ```

2. **Update the HTML selector**: Add your language option to `web/index.html`:
   ```html
   <option value="fr">Français</option>
   ```

3. **Test the application**: 
   - Start Anchorr: `node app.js`
   - Visit http://localhost:8282
   - Change the language in the interface
   - Navigate through different sections to see your translations

### Example Translation Process

Let's say you're creating a French translation:

1. Copy `template.json` to `fr.json`
2. Update the `_meta` section:
   ```json
   {
     "_meta": {
       "language_name": "Français",
       "language_code": "fr",
       "contributors": ["Your Name"],
       "completion": "100%",
       "last_updated": "2025-12-14",
       "notes": "Complete French translation"
     },
     ...
   }
   ```

3. Translate each section:
   ```json
   "common": {
     "yes": "Oui",
     "no": "Non",
     "save": "Enregistrer",
     "cancel": "Annuler",
     ...
   }
   ```

4. Add French to the language selector in code
5. Test and submit!

### Submitting Your Translation

1. **Create a fork** of the Anchorr repository
2. **Add your translation file** to the `locales/` directory
3. **Update the language selector** in the code (as described above)
4. **Test thoroughly** to ensure everything works
5. **Create a pull request** with a description of your translation

### Language Codes
Use standard 2-letter ISO codes: `fr`, `es`, `it`, `pt`, `ru`, `zh`, `ja`, `ko`

### Available Languages

Currently supported languages:
- 🇺🇸 English (`en`) - Complete
- 🇩🇪 German (`de`) - Complete

Your contribution will be listed here once submitted!

### Translation Status

You can help improve Anchorr by:
- Adding a new language translation
- Improving existing translations
- Adding missing strings to the template
- Updating outdated translations

### Need Help?

- **Check existing translations**: Look at `de.json` for guidance
- **Ask questions**: Join our Discord server for translation discussions
- **Report issues**: If you find missing strings or bugs, please report them

Thank you for contributing to make Anchorr accessible to more users worldwide! 🌍

## 💬 Communication

- **Questions?** Open an issue with the `question` label
- **Discussion?** Start a GitHub Discussion
- **Need help?** Check existing documentation or issues first
