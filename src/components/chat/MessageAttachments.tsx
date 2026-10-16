import { FileText, Download, ImageIcon } from 'lucide-react';
import { MessageAttachment } from '../../services/messages.service';

interface Props {
  attachments?: MessageAttachment[];
  isMe?: boolean;
}

const isImage = (att: MessageAttachment) => (att.type || '').startsWith('image/');

export function MessageAttachments({ attachments, isMe }: Props) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {attachments.map((att, i) =>
        isImage(att) ? (
          <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="block">
            <img
              src={att.url}
              alt={att.name}
              className="max-h-48 w-auto rounded-lg border border-white/10 object-cover hover:opacity-90 transition-opacity"
            />
          </a>
        ) : (
          <a
            key={i}
            href={att.url}
            target="_blank"
            rel="noopener noreferrer"
            download={att.name}
            className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-colors ${
              isMe
                ? 'bg-white/10 border-white/20 hover:bg-white/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="w-8 h-8 rounded bg-brand-purple/30 flex items-center justify-center shrink-0">
              {isImage(att) ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{att.name}</p>
              {att.size && <p className="text-[10px] opacity-60">{att.size}</p>}
            </div>
            <Download className="w-4 h-4 shrink-0 opacity-60" />
          </a>
        )
      )}
    </div>
  );
}
