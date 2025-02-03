import { CountdownTimer } from "@/components/countdown-timer";
import { formatDate } from "@/lib/utils";
import { type SelectInvitation } from "@db/schema";
import { motion } from "framer-motion";

interface TemplateProps {
  invitation: SelectInvitation;
}

export default function Template3({ invitation }: TemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid md:grid-cols-2 min-h-screen">
        <div
          className="hidden md:block bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1510076857177-7470076d4098)`,
          }}
        />
        
        <div className="p-8 md:p-12 flex items-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full space-y-8"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-center mb-8">
              <div>{invitation.brideNames}</div>
              <div className="text-primary my-4">&</div>
              <div>{invitation.groomNames}</div>
            </h1>

            <div className="my-12">
              <CountdownTimer targetDate={new Date(invitation.date)} />
            </div>

            <div className="text-center space-y-2 mb-12">
              <p className="text-2xl text-primary">
                {formatDate(new Date(invitation.date))}
              </p>
              <p className="text-xl text-muted-foreground">{invitation.venue}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {invitation.photos.map((photo, index) => (
                <motion.div
                  key={photo}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="aspect-square"
                >
                  <img
                    src={photo}
                    alt="Wedding"
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
