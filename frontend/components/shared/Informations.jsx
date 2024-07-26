import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const Informations = ({ hash, isConfirming, isConfirmed, error }) => {
  return (
    <div>
        {isConfirming && 
          <Alert className="bg-yellow-200 mt-5 mb-5">
            
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              La transaction est en train d'être confirmée.
            </AlertDescription>
          </Alert>} 
        {isConfirmed && 
          <Alert className="bg-lime-200 mt-5 mb-5">
            
            <AlertTitle>Bravo !</AlertTitle>
            <AlertDescription>
              Transaction confirmée.
            </AlertDescription>
          </Alert>}
        {error && (
          <Alert className="bg-rose-200 mt-5 mb-5">
              
            <AlertTitle>Erreur !</AlertTitle>
            <AlertDescription>
              Erreur : {error.shortMessage || error.message}
            </AlertDescription>
          </Alert>
        )} 
        {hash && 
          <Alert className="bg-lime-200 mt-5 mb-5">
            
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Hash de la transaction : {hash}
            </AlertDescription>
          </Alert>
        } 
    </div>
  )
}

export default Informations