import axios from 'axios';


function UploadImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const SelectFile = (event) => {
    setSelectedFile(event.target.files[0]); // Get the first selected file
  };
  
  async function Upload(){
      try {
        console.log(selectedFile)
	   if (!selectedFile) return;
       if (selectedFile.size > 1024 * 1024){
        throw new Error("Arquivo tem que ser menor que 1mb")
       }
       if (!selectedFile.type.startsWith("image/")) {
        throw new Error("O arquivo deve ser uma imagem");
       }
    
      const formData = new FormData();
      formData.append('image', selectedFile);
      

        await axios.post('http://localhost:3000/Image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            "Accept": '.jpg, .png, .webp, .gif'
          }
        });

        window.location.reload();
        
      } catch (err) {
        if (err instanceof Error) {
          setError(`${err.message}`);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
      }
  }

  return (
    <div className='UploadImage'>
      <input type="file" onChange={SelectFile} />
      <button type="submit" onClick={Upload}>Enviar</button>
        {error && <p style={{ color: 'red', fontStyle: 'italic' }}>{error}</p>}
    </div>
  );
}

export default UploadImage