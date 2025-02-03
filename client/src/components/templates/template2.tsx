import { CountdownTimer } from "@/components/countdown-timer";
import { formatDate } from "@/lib/utils";
import { type SelectInvitation } from "@db/schema";
import { motion } from "framer-motion";

interface TemplateProps {
  invitation: SelectInvitation;
}

export default function Template2({ invitation }: TemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      <div
        className="h-[40vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2)`,
        }}
      />
      
      <div className="container mx-auto px-4 -mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-card rounded-lg shadow-xl p-8 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-serif mb-6">
            {invitation.brideNames}
            <span className="text-primary mx-4">&</span>
            {invitation.groomNames}
          </h1>

          <div className="my-8">
            <CountdownTimer targetDate={new Date(invitation.date)} />
          </div>

          <div className="text-xl space-y-2 mb-12">
            <p className="text-primary">{formatDate(new Date(invitation.date))}</p>
            <p className="text-muted-foreground">{invitation.venue}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {invitation.photos.map((photo, index) => (
              <motion.div
                key={photo}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="aspect-[3/4]"
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
  );
}
