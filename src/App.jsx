import { useState, useRef } from 'react'
import './App.css'
import AceEditor from "react-ace";
import formatXml from 'xml-formatter';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
/**
 * App.jsx
 * Um simples formatador de JSON usando React e Tailwind CSS.
 * Permite colar um JSON, formatá-lo e exibir o resultado.
 */

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const editorRef = useRef(null);

  const handleCopy = () => {
    if (editorRef.current) {
      const editorContent = editorRef.current.editor.getValue(); // Obtém o conteúdo do editor
      navigator.clipboard.writeText(editorContent) // Copia para a área de transferência
        .then(() => setError("Conteúdo copiado com sucesso!"))
        .catch(() => setError("Erro ao copiar o conteúdo."));
    }
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const prettyJson = JSON.stringify(parsed, null, 2);
      console.log(prettyJson);
      setOutput(prettyJson);
      setError("");
    } catch {
      setError("JSON inválido! Verifique a sintaxe.");
    }
  };

   const formatXML = () => {
    try {
      const prettyXml = formatXml(input, {
        indentation: '  ', // dois espaços
        collapseContent: true
      });
      console.log(prettyXml);
      setOutput(prettyXml);
      setError("");
    } catch {
      setError("XML inválido! Verifique a sintaxe.");
    }
  };

 const formatarFinal = () => {
    if (input.trim().startsWith("<")) {
      formatXML();
    } else {
      formatJSON();
    }
  }


  const downloadXML = () => {
  const blob = new Blob([output], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'arquivo-formatado.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadJSON = () => {
  const blob = new Blob([output], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'arquivo-formatado.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

  return (
    <div className=" gap-5">
      <h1 className="text-2xl font-bold mb-10">🔧 Formatador</h1>
      <div className="bg-red-500 m-10">
        <textarea
          className="w-full h-48 p-2 border rounded mb-10 resize-none"
          rows="10"
          cols="80"
          placeholder="Cole aqui seu Json ou xml..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className=" mt-4">
          <button
            onClick={formatarFinal}  
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Formatar
          </button>
        </div>

      </div>
      <div className="flex mt-5">
        {output && (
          <div className="flex mt-4">
            <AceEditor
              mode={output.trim().startsWith("<") ? "xml" : "json"}
              ref={editorRef}
              theme={darkMode ? "monokai" : "github"}
              name="json-output"
              value={output}
              readOnly={true}
              fontSize={14}
              width="100%"
              height="300px"
              setOptions={{
                useWorker: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
            {output.trim().startsWith("<") && ( 
            <button onClick={downloadXML}>
              Exportar como .XML
            </button>
            )}
            {output.trim().startsWith("{") && ( 
            <button onClick={downloadJSON}>
              Exportar como .JSON
            </button>
            )}
            <button onClick={handleCopy}>
              <image src="/public/edit_copy_icon_124983.svg"  />
              Copiar
            </button>
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="px-4 py-2 rounded border border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? "☀️ Claro" : "🌙 Escuro"}
            </button>
          </div>
        )}
      </div>
      <div className="col-span-6 col-start-1 row-start-1">

      </div>
      <div className="col-span-6 row-span-2 row-start-5">


        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
}


