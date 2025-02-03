import { CountdownTimer } from "@/components/countdown-timer";
import { formatDate } from "@/lib/utils";
import { type SelectInvitation } from "@db/schema";
import { motion } from "framer-motion";

interface TemplateProps {
  invitation: SelectInvitation;
}

export default function Template1({ invitation }: TemplateProps) {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1489924124654-85017dad789d)`,
      }}
    >
      <div className="container mx-auto px-4 py-16 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-serif mb-4">
            {invitation.brideNames} & {invitation.groomNames}
          </h1>

          <p className="text-2xl">We're getting married!</p>

          <div className="my-8">
            <CountdownTimer targetDate={new Date(invitation.date)} />
          </div>

          <div className="text-xl space-y-2">
            <p>{formatDate(new Date(invitation.date))}</p>
            <p>{invitation.venue}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
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
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
