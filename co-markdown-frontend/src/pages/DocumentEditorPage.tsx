import { useParams } from 'react-router';

export default function DocumentEditorPage() {
  const { documentId } = useParams();
  return (
    <>
      DocumentEditorPage <br />
      documentId: {documentId}
    </>
  );
}