import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center mb-8">
            <Heart className="text-primary h-12 w-12 animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Create Your Perfect Wedding Invitation
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Design beautiful digital wedding invitations with custom photos, music, and countdown timers
          </p>

          <Link href="/create">
            <Button size="lg" className="mt-8">
              Create Invitation
            </Button>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              "https://images.unsplash.com/photo-1489924124654-85017dad789d",
              "https://images.unsplash.com/photo-1551468307-8c1e3c78013c",
              "https://images.unsplash.com/photo-1551546897-0cf94d9bb428"
            ].map((url, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src={url} 
                    alt={`Wedding template ${index + 1}`}
                    className="w-full h-48 object-cover transition-transform hover:scale-105"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
