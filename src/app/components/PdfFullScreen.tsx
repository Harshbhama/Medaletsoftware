import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Expand } from "lucide-react";
import { useState } from "react";
import SimpleBar from "simplebar-react";
import { Document } from "react-pdf";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import {Page} from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

interface PdfFullScreenProps {
  fileUrl?: String
}
const PdfFullScreen = ({fileUrl}: PdfFullScreenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>();
  const {toast} = useToast();
  const { width, ref } = useResizeDetector();
  return(
    <Dialog open={isOpen} onOpenChange={(v) => {
      console.log(v)
      if(!v){
        setIsOpen(v)
      }
    }}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button aria-label="full-screen" variant="ghost" className="gap-1.5"
        ><Expand className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide = {false} className = 'max-h-[calc(100vh-10rem)] mt-6'>
        <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              file={String(fileUrl)}
              onLoadError={() => {
                toast({
                  title: "Error",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
              className="max-h-full"
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
              }}
              >
              {
                new Array(numPages).fill(0).map((_, index) => {
                  return(
                    <Page 
                      key={index}
                      pageNumber={index+1}
                    />
                  )
                })

              }
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  )
}
export default PdfFullScreen;