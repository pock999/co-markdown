import { useParams } from 'react-router';

export default function DocumentPreviewPage() {
  const { documentId } = useParams();

  return (
    <>
      DocumentPreviewPage <br />
      documentId: {documentId}
    </>
  );
}