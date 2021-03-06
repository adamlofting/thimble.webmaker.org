define(function(require) {
  var $ = require("jquery"),
      Slowparse = require("slowparse/slowparse"),
      ParsingCodeMirror = require("fc/ui/parsing-codemirror"),
      Help = require("fc/help"),
      LivePreview = require("fc/ui/live-preview"),
      ErrorHelp = require("fc/ui/error-help"),
      ContextSensitiveHelp = require("fc/ui/context-sensitive-help"),
      Relocator = require("fc/ui/relocator"),
      HelpMsgTemplate = require("template!help-msg"),
      ErrorMsgTemplate = require("template!error-msg");

  require('slowparse-errors');
  require("codemirror/html");

  return function EditorPanes(options) {
    var self = {},
        div = options.container,
        initialValue = options.value || "",
        allowJS = options.allowJS || false,
        sourceCode = $('<div class="source-code"></div>').attr('id','webmaker-source-code-pane').appendTo(div),
        previewArea = $('<div class="preview-holder"></div>').attr('id','webmaker-preview-holder-pane').appendTo(div),
        helpArea = $('<div class="help hidden"></div>').appendTo(div),
        errorArea =  $('<div class="error hidden"></div>').appendTo(div);

    var codeMirror = self.codeMirror = ParsingCodeMirror(sourceCode[0], {
      mode: "text/html",
      theme: "jsbin",
      tabMode: "indent",
      lineWrapping: true,
      lineNumbers: true,
      gutters: [
        "CodeMirror-linenumbers",
        "gutter-markers"
      ],
      value: initialValue,
      parse: function(html) {
        return Slowparse.HTML(document, html, {
          disallowActiveAttributes: true
        });
      },
      extraKeys: {"Ctrl-Space": "autocomplete"},
      dataProtector: options.dataProtector
    });
    var relocator = Relocator(codeMirror);
    var cursorHelp = self.cursorHelp = ContextSensitiveHelp({
      codeMirror: codeMirror,
      helpIndex: Help.Index(),
      template: HelpMsgTemplate,
      helpArea: helpArea,
      relocator: relocator
    });
    var errorHelp = ErrorHelp({
      codeMirror: codeMirror,
      template: ErrorMsgTemplate,
      errorArea: errorArea,
      relocator: relocator
    });
    var preview = self.preview = LivePreview({
      codeMirror: codeMirror,
      ignoreErrors: options.ignoreErrors || false,
      previewArea: previewArea,
      previewLoader: options.previewLoader
    });

    return self;
  };
});
