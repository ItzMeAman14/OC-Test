
export default function handleKeyPress(event,input,setInput) {
    const { selectionStart, selectionEnd } = event.target;
    if (event.key === 'Tab') {
      event.preventDefault();
      const start = selectionStart;
      const end = selectionEnd;
      const spaces = '    ';
      setInput(input.substring(0, start) + spaces + input.substring(end));

      setTimeout(() => {
        event.target.selectionStart = event.target.selectionEnd = start + spaces.length;
      }, 0);
    }

    if (event.key === '(') {
      event.preventDefault();
      setInput(input.substring(0, selectionStart) + '()' + input.substring(selectionEnd));

      setTimeout(() => {
        event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
      }, 0);
    }

    if (event.key === '{') {
      event.preventDefault();
      setInput(input.substring(0, selectionStart) + '{}' + input.substring(selectionEnd));

      setTimeout(() => {
        event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
      }, 0);
    }

    if (event.key === "'") {
      event.preventDefault();
      setInput(input.substring(0, selectionStart) + "''" + input.substring(selectionEnd));

      setTimeout(() => {
        event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
      }, 0);
    }

    if (event.key === '"') {
      event.preventDefault();
      setInput(input.substring(0, selectionStart) + '""' + input.substring(selectionEnd));

      setTimeout(() => {
        event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
      }, 0);
    }

    if (event.key === '[') {
      event.preventDefault();
      setInput(input.substring(0, selectionStart) + '[]' + input.substring(selectionEnd));

      setTimeout(() => {
        event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
      }, 0);
    }

    if (event.key === 'Enter') {
      const lastKey = input.charAt(input.length - 1);
      if (lastKey === ':') {
        event.preventDefault();
        const textBefore = input.substring(0,selectionStart + 1)
        const textAfter = input.substring(selectionEnd)
        
        const linesBefore = input.split('\n');
        const lastLine = linesBefore[linesBefore.length - 1]

        const indentLevel = lastLine.match(/^\s*/)[0].length
        setInput(textBefore + '\n' + ' '.repeat(indentLevel + 4) + textAfter);

        setTimeout(() => {
          event.target.selectionStart = event.target.selectionEnd = selectionStart + 5 + indentLevel;
        }, 0);
      }
    }
}