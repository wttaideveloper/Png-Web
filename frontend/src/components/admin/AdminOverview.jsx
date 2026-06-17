import { motion } from "framer-motion";
import { ArrowRight, Clock3, ExternalLink, Layers3 } from "lucide-react";
import { quickActions } from "./panelConfig";

export default function AdminOverview({ onOpenPanel, hasChanges, lastSavedAt, sectionCount = 8 }) {
  return (
    <section className="admin-overview">
      <div className="admin-overview-hero">
        <div>
          <p className="admin-overview-eyebrow">Welcome back</p>
          <h2>Homepage content dashboard</h2>
          <p className="help-text">
            Pick a task below or use the sidebar to jump straight to any section. Save when you are ready — changes go
            live on the public homepage.
          </p>
        </div>
        <a className="admin-ghost-btn admin-overview-preview" href="/" target="_blank" rel="noreferrer">
          Open live site
          <ExternalLink size={15} />
        </a>
      </div>

      <div className="admin-overview-stats">
        <motion.div className="admin-stat-card" whileHover={{ y: -2 }}>
          <Layers3 size={18} />
          <div>
            <strong>{sectionCount}</strong>
            <span>Editable sections</span>
          </div>
        </motion.div>
        <motion.div className="admin-stat-card" whileHover={{ y: -2 }}>
          <Clock3 size={18} />
          <div>
            <strong>{hasChanges ? "Unsaved" : "Up to date"}</strong>
            <span>{lastSavedAt ? `Last saved ${lastSavedAt}` : "No saves this session"}</span>
          </div>
        </motion.div>
      </div>

      <div className="admin-quick-grid">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              type="button"
              className="admin-quick-card"
              onClick={() => onOpenPanel(action.id)}
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <div className="admin-quick-card-icon">
                <Icon size={20} />
              </div>
              <div className="admin-quick-card-copy">
                <strong>{action.label}</strong>
                <p>{action.description}</p>
              </div>
              <ArrowRight size={18} className="admin-quick-card-arrow" />
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
