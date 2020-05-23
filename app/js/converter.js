/* global md5, asciidoctor, XMLHttpRequest, Asciidoctor, AsciidoctorKroki */
const processor = Asciidoctor({ runtime: { platform: 'browser' } })

class AsciidoctorBrowserExtensionHtml5Converter {
  constructor () {
    this.baseConverter = asciidoctor.Html5Converter.$new()
  }

  convert (node, transform) {
    if (node.getNodeName() === 'document') {
      const bodyAttrs = node.getId() ? [`id="${node.getId()}"`] : []
      let classes
      const sectioned = node.hasSection()
      if (sectioned && node.isAttribute('toc-class') && node.isAttribute('toc') &&  node.isAttribute('toc-placement', 'auto')) {
        classes = [node.getDoctype(), node.getAttribute('toc-class'), `toc-${node.getAttribute('toc-position', 'header')}`]
      } else {
        classes = [node.getDoctype()]
      }
      if (node.hasRole()) {
        classes.push(node.getRole())
      }
      bodyAttrs.push(`class="${classes.join(' ')}"`)
      if (node.isAttribute('max-width')) {
        bodyAttrs.push(`style=""max-width: ${node.getAttribute('max-width')};"`)
      }
      const result = []
      result.push(`<body ${bodyAttrs.join(' ')}>`)
      if (!node.getNoheader()) {
        result.push('<div id="header">')
        if (node.getDoctype() === 'manpage') {
          result.push(`<h1>${node.getDocumentTitle()} Manual Page</h1>`)
          if (sectioned && node.isAttribute('toc') && node.isAttribute('toc-placement', 'auto')) {
            result.push(`<div id="toc" class="${node.getAttribute('toc-class', 'toc')}">`)
          }
        }
      }
      unless node.noheader
      result <<
      if node.doctype == 'manpage'
        result << %(<h1>#{node.doctitle} Manual Page</h1>)
      if sectioned && (node.attr? 'toc') && (node.attr? 'toc-placement', 'auto')
        result << %(<div id="toc" class="#{node.attr 'toc-class', 'toc'}">
        <div id="toctitle">#{node.attr 'toc-title'}</div>
        #{node.converter.convert node, 'outline'}
        </div>)
      end
      result << (generate_manname_section node) if node.attr? 'manpurpose'
      else
      if node.header?
        result << %(<h1>#{node.header.title}</h1>) unless node.notitle
        details = []
        idx = 1
      node.authors.each do |author|
      details << %(<span id="author#{idx > 1 ? idx : ''}" class="author">#{node.sub_replacements author.name}</span>#{br})
      details << %(<span id="email#{idx > 1 ? idx : ''}" class="email">#{node.sub_macros author.email}</span>#{br}) if author.email
      idx += 1
      end
      if node.attr? 'revnumber'
        details << %(<span id="revnumber">#{((node.attr 'version-label') || '').downcase} #{node.attr 'revnumber'}#{(node.attr? 'revdate') ? ',' : ''}</span>)
      end
      if node.attr? 'revdate'
        details << %(<span id="revdate">#{node.attr 'revdate'}</span>)
      end
      if node.attr? 'revremark'
        details << %(#{br}<span id="revremark">#{node.attr 'revremark'}</span>)
      end
      unless details.empty?
        result << '<div class="details">'
        result.concat details
      result << '</div>'
      end
      end

      if sectioned && (node.attr? 'toc') && (node.attr? 'toc-placement', 'auto')
        result << %(<div id="toc" class="#{node.attr 'toc-class', 'toc'}">
        <div id="toctitle">#{node.attr 'toc-title'}</div>
        #{node.converter.convert node, 'outline'}
        </div>)
      end
      end
      result << '</div>'
      end

      result << %(<div id="content">
        #{node.content}
        </div>)

      if node.footnotes? && !(node.attr? 'nofootnotes')
      result << %(<div id="footnotes">
        <hr#{slash}>)
      node.footnotes.each do |footnote|
      result << %(<div class="footnote" id="_footnotedef_#{footnote.index}">
        <a href="#_footnoteref_#{footnote.index}">#{footnote.index}</a>. #{footnote.text}
        </div>)
      end
      result << '</div>'
      end

      unless node.nofooter
      result << '<div id="footer">'
      result << '<div id="footer-text">'
      result << %(#{node.attr 'version-label'} #{node.attr 'revnumber'}#{br}) if node.attr? 'revnumber'
        result << %(#{node.attr 'last-update-label'} #{node.attr 'docdatetime'}) if (node.attr? 'last-update-label') && !(node.attr? 'reproducible')
      result << '</div>'
      result << '</div>'
      end

      # JavaScript (and auxiliary stylesheets) loaded at the end of body for performance reasons
      # See http://www.html5rocks.com/en/tutorials/speed/script-loading/

        if syntax_hl
          if syntax_hl.docinfo? :head
            result[syntax_hl_docinfo_head_idx] = syntax_hl.docinfo :head, node, cdn_base_url: cdn_base_url, linkcss: linkcss, self_closing_tag_slash: slash
    else
      result.delete_at syntax_hl_docinfo_head_idx
      end
      if syntax_hl.docinfo? :footer
        result << (syntax_hl.docinfo :footer, node, cdn_base_url: cdn_base_url, linkcss: linkcss, self_closing_tag_slash: slash)
      end
      end

      if node.attr? 'stem'
        eqnums_val = node.attr 'eqnums', 'none'
      eqnums_val = 'AMS' if eqnums_val.empty?
        eqnums_opt = %( equationNumbers: { autoNumber: "#{eqnums_val}" } )
      # IMPORTANT inspect calls on delimiter arrays are intentional for JavaScript compat (emulates JSON.stringify)
      result << %(<script type="text/x-mathjax-config">
        MathJax.Hub.Config({
          messageStyle: "none",
          tex2jax: {
            inlineMath: [#{INLINE_MATH_DELIMITERS[:latexmath].inspect}],
            displayMath: [#{BLOCK_MATH_DELIMITERS[:latexmath].inspect}],
            ignoreClass: "nostem|nolatexmath"
          },
          asciimath2jax: {
            delimiters: [#{BLOCK_MATH_DELIMITERS[:asciimath].inspect}],
            ignoreClass: "nostem|noasciimath"
          },
          TeX: {#{eqnums_opt}}
        })
      MathJax.Hub.Register.StartupHook("AsciiMath Jax Ready", function () {
        MathJax.InputJax.AsciiMath.postfilterHooks.Add(function (data, node) {
          if ((node = data.script.parentNode) && (node = node.parentNode) && node.classList.contains("stemblock")) {
            data.math.root.display = "block"
          }
          return data
        })
      })
      </script>
      <script src="#{cdn_base_url}/mathjax/#{MATHJAX_VERSION}/MathJax.js?config=TeX-MML-AM_HTMLorMML"></script>)
      end

      unless (docinfo_content = node.docinfo :footer).empty?
        result << docinfo_content
        end

      result << '</body>'
      result << '</html>'
      result.join LF
      end





    }
    return this.baseConverter.convert(node, transform)
  }
}

  convert (node, transform) {
    const nodeName = transform || node.getNodeName()
    if (nodeName === 'embedded') {
      return `<embedded>
${node.getContent()}
</embedded>`
    } else if (nodeName === 'document') {
      return `<document>
${node.getContent()}
</document>`
    } else if (nodeName === 'section') {
      return `${node.getTitle()}`
    }
    return ''
  }
}

processor.ConverterFactory.register(new AsciidoctorBrowserExtensionHtml5Converter(), ['html5'])

asciidoctor.browser.converter = (webExtension, Constants, Settings) => {
  const module = {}

  module.convert = async (url, source) => {
    const settings = await Settings.getRenderingSettings()
    const options = buildAsciidoctorOptions(settings, url)
    const doc = processor.load(source, options)
    /*
    if (showTitle(doc)) {
      doc.setAttribute('showtitle')
    }
     */
    doc.setAttribute('noheader')
    doc.setAttribute('notitle')
    if (isSourceHighlighterEnabled(doc)) {
      // Force the source highlighter to Highlight.js (since we only support Highlight.js)
      doc.setAttribute('source-highlighter', 'highlight.js')
    }
    const authors = doc.getAuthors().map((author) => {
      let email
      if (author.getEmail()) {
        email = doc.$sub_macros(author.getEmail())
      }
      return {
        name: doc.$sub_replacements(author.getName()),
        firstName: author.getFirstName(),
        middleName: author.getMiddleName(),
        lastName: author.getLastName(),
        initials: author.getInitials(),
        email
      }
    })
    const revisionInfo = doc.getRevisionInfo()
    return {
      html: doc.convert(),
      text: source,
      title: doc.getDoctitle({ use_fallback: true }),
      doctype: doc.getDoctype(),
      attributes: {
        noHeader: doc.getNoheader(),
        noTitle: doc.getNotitle(),
        noFooter: doc.getNofooter(),
        authors,
        revisionInfo,
        documentTitle: doc.getDocumentTitle(),
        versionLabel: doc.getAttribute('version-label', '').toLowerCase(),
        tocPosition: doc.getAttribute('toc-position'),
        isSourceHighlighterEnabled: isSourceHighlighterEnabled(doc),
        isStemEnabled: isStemEnabled(doc),
        isFontIcons: doc.getAttribute('icons') === 'font',
        maxWidth: doc.getAttribute('max-width'),
        eqnumsValue: doc.getAttribute('eqnums', 'none'),
        stylesheet: doc.getAttribute('stylesheet')
      }
    }
  }

  module.fetchAndConvert = async (url, initial) => {
    const request = await module.executeRequest(url)
    if (module.isHtmlContentType(request)) {
      // content is not plain-text!
      return undefined
    }
    if (request.status !== 200 && request.status !== 0) {
      // unsuccessful request!
      return undefined
    }
    const source = request.responseText
    if (await Settings.isExtensionEnabled()) {
      const md5key = 'md5' + url
      if (!initial) {
        const md5sum = await Settings.getSetting(md5key)
        if (md5sum && md5sum === md5(source)) {
          // content didn't change!
          return undefined
        }
      }
      // content has changed...
      const result = await module.convert(url, source)
      // Update md5sum
      const value = {}
      value[md5key] = md5(source)
      webExtension.storage.local.set(value)
      return result
    }
    return {
      text: source
    }
  }

  module.executeRequest = (url) => new Promise((resolve, reject) => {
    try {
      const request = new XMLHttpRequest()
      if (request.overrideMimeType) {
        request.overrideMimeType('text/plain;charset=utf-8')
      }
      request.onreadystatechange = (event) => {
        if (request.readyState === XMLHttpRequest.DONE) {
          resolve(request)
        }
      }
      // disable cache
      request.open('GET', url, true)
      request.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
      request.send(null)
    } catch (err) {
      console.error(`Unable to GET ${url}`, err)
      reject(err)
    }
  })

  /**
   * Is the content type html ?
   * @param request The request
   * @return true if the content type is html, false otherwise
   */
  module.isHtmlContentType = (request) => {
    const contentType = request.getResponseHeader('Content-Type')
    return contentType && (contentType.indexOf('html') > -1)
  }

  // REMIND: notitle attribute is automatically set when header_footer equals false.
  const showTitle = (doc) => !doc.isAttribute('noheader')

  /**
   * Is the :source-highlighter: attribute defined ?
   * @param doc
   * @returns {boolean}
   */
  const isSourceHighlighterEnabled = (doc) => doc.isAttribute('source-highlighter')

  /**
   * Is the :stem: attribute defined ?
   * @param doc
   * @returns {boolean}
   */
  const isStemEnabled = (doc) => doc.isAttribute('stem')

  /**
   * Parse URL query parameters
   */
  const getAttributesFromQueryParameters = (url) => {
    const query = new URL(url).search.substr(1)
    const result = []
    query.split('&').forEach((part) => {
      // part can be empty
      if (part) {
        const item = part.split('=')
        const key = item[0]
        const value = item[1]
        if (typeof value !== 'undefined') {
          // FIXME: decode!
          const escapedValue = decodeURIComponent(value)
          result.push(key.concat('=').concat(escapedValue))
        } else {
          result.push(key)
        }
      }
    })
    return result
  }

  const httpGet = (uri, encoding = 'utf8') => {
    let data = ''
    let status = -1
    try {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', uri, false)
      if (encoding === 'binary') {
        xhr.responseType = 'arraybuffer'
      }
      xhr.addEventListener('load', function () {
        status = this.status
        if (status === 200 || status === 0) {
          if (encoding === 'binary') {
            const arrayBuffer = xhr.response
            const byteArray = new Uint8Array(arrayBuffer)
            for (let i = 0; i < byteArray.byteLength; i++) {
              data += String.fromCharCode(byteArray[i])
            }
          } else {
            data = this.responseText
          }
        }
      })
      xhr.send()
    } catch (e) {
      throw new Error(`Error reading file: ${uri}; reason: ${e.message}`)
    }
    // assume that no data means it doesn't exist
    if (status === 404 || !data) {
      throw new Error(`No such file: ${uri}`)
    }
    return data
  }

  /**
   * Build Asciidoctor options from settings
   */
  const buildAsciidoctorOptions = (settings, url) => {
    const attributesQueryParameters = getAttributesFromQueryParameters(url)
    const customAttributes = settings.customAttributes
    const safeMode = settings.safeMode
    // Default attributes
    const attributes = [
      'icons=font@',
      'platform=opal',
      'platform-opal',
      'env=browser',
      'env-browser',
      'data-uri!',
      `kroki-server-url=${settings.krokiServerUrl}@`]
    const href = new URL(url).href
    const fileName = href.split('/').pop()
    attributes.push(`docfile=${href}`)
    // Inter-document cross references must point to AsciiDoc source files
    attributes.push('outfilesuffix=.adoc')
    const fileNameExtensionPair = fileName.split('.')

    if (fileNameExtensionPair.length > 1) {
      let fileExtension = fileNameExtensionPair[fileNameExtensionPair.length - 1]
      // Remove query parameters
      fileExtension = fileExtension.split('?')[0]
      // Remove fragment identifier
      fileExtension = fileExtension.split('#')[0]
      attributes.push(`docfilesuffix=.${fileExtension}`)
    }
    if (fileNameExtensionPair.length > 0) {
      const docname = fileNameExtensionPair[0]
      attributes.push(`docname=${docname}`)
    }
    if (customAttributes) {
      attributes.push(customAttributes)
    }
    const parts = href.split('/') // break the string into an array
    parts.pop() // remove its last element
    const pwd = parts.join('/')
    attributes.push(`docdir=${pwd}`)
    if (attributesQueryParameters.length > 0) {
      Array.prototype.push.apply(attributes, attributesQueryParameters)
    }
    // Forcibly remove the "kroki-fetch-diagram" attribute because this feature is not supported in a browser environment.
    attributes.push('kroki-fetch-diagram!')
    const registry = processor.Extensions.create()
    if (settings.krokiEnabled) {
      AsciidoctorKroki.register(registry, {
        vfs: {
          read: (path, encoding = 'utf8') => {
            let absolutePath
            if (path.startsWith('file://') || path.startsWith('http://') || path.startsWith('https://')) {
              // absolute path
              absolutePath = path
            } else {
              absolutePath = pwd + '/' + path
            }
            return httpGet(absolutePath, encoding)
          },
          exists: (_) => {
            return false
          },
          add: (_) => {
            // no-op
          }
        }
      })
    }
    return {
      safe: safeMode,
      extension_registry: registry,
      backend: 'html5', // Force backend to html5
      attributes: attributes.join(' ') // Pass attributes as String
    }
  }

  return module
}


