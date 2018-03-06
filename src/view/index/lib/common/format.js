const beautifyHtml = require('js-beautify').html

function format(data) {
  return beautifyHtml(data, {
    indent_size: 2,
    space_after_anon_function: true,
    brace_style: 'collapse',
    indent_char: ' ',
    preserve_newlines: true,
    // List of tags that should not be reformatted
    unformatted: [],
    // [keep|separate|normal]
    indent_scripts: 'keep',
    eol: '\n',
    indent_level: 0,
    indent_with_tabs: false,
    max_preserve_newlines: 10,
    jslint_happy: false,
    keep_array_indentation: false,
    keep_function_indentation: false,
    space_before_conditional: true,
    break_chained_methods: false,
    eval_code: false,
    unescape_strings: false,
    wrap_line_length: 0,
    wrap_attributes: 'auto',
    wrap_attributes_indent_size: 2,
    end_with_newline: false
  })
}

export default format;
