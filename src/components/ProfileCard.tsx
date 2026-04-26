import profile from '@/../content/profile.json';
import { Avatar } from './Avatar';

export function ProfileCard() {
  return (
    <aside className="bg-panel border border-border rounded-2xl p-6 sticky top-20">
      <div className="flex flex-col items-center text-center">
        <div className="size-28 rounded-full bg-[#1f2330] border border-border overflow-hidden mb-4">
          <Avatar src={profile.photo} alt={profile.name} fallback={profile.name.slice(0, 1)} />
        </div>
        <h1 className="text-xl font-semibold text-white">{profile.name}</h1>
        <p className="text-xs text-muted mt-1">{profile.title}</p>
      </div>

      <p className="text-sm text-[#cbd0dc] mt-5 leading-6 whitespace-pre-line">
        {profile.intro}
      </p>

      {profile.finalVocabulary && (
        <div className="mt-5 text-center">
          <span className="text-[10px] uppercase tracking-widest text-muted">
            Final Vocabulary
          </span>
          <div className="mt-1 inline-block px-3 py-1 rounded-full bg-accent/15 text-accent text-sm font-mono">
            {profile.finalVocabulary}
          </div>
        </div>
      )}

      <Section title="Contact">
        <ul className="space-y-1.5 text-sm">
          {profile.contacts.map((c) => (
            <li key={c.label} className="flex justify-between">
              <span className="text-muted">{c.label}</span>
              {c.href ? (
                <a href={c.href} className="text-[#e7eaf2] hover:text-accent" target="_blank" rel="noreferrer">
                  {c.value}
                </a>
              ) : (
                <span>{c.value}</span>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="학력">
        <ul className="space-y-1.5 text-sm">
          {profile.education.map((e) => (
            <li key={e.school}>
              <div className="text-[#e7eaf2]">{e.school}</div>
              <div className="text-xs text-muted">{e.period}</div>
            </li>
          ))}
        </ul>
      </Section>

      {profile.activities.length > 0 && (
        <Section title="활동">
          <ul className="space-y-1.5 text-sm">
            {profile.activities.map((a) => (
              <li key={a.name}>
                <div className="text-[#e7eaf2]">{a.name}</div>
                <div className="text-xs text-muted">{a.period}</div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {profile.awards.length > 0 && (
        <Section title="수상">
          <ul className="space-y-1.5 text-sm">
            {profile.awards.map((a, i) => (
              <li key={i}>{(a as { name: string }).name}</li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="기술 스택">
        <div className="space-y-2">
          {Object.entries(profile.stack).map(([cat, items]) => (
            <div key={cat}>
              <div className="text-xs text-muted mb-1">{cat}</div>
              <div className="flex flex-wrap gap-1.5">
                {(items as string[]).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-[#1f2330] text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 pt-5 border-t border-border">
      <h2 className="text-[11px] uppercase tracking-widest text-muted mb-3">{title}</h2>
      {children}
    </section>
  );
}
