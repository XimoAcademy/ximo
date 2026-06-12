-- ════════════════════════════════════════════════════════════════════════
-- Ximo — NCAA D1 men's swimming coach contacts (public directory data).
-- Idempotent: only inserts coaches for programs that have none yet, so it can
-- be re-run safely as more programs are harvested. Apply with a UTF-8 paste.
-- ════════════════════════════════════════════════════════════════════════

insert into public.ncaa_coaches (program_id, name, title, email, sort_order)
select p.id, v.name, v.title, v.email, v.ord
from (values
  ('arizona','Ben Loorz','Swimming and Diving Head Coach',null,0),
  ('arizona','Dwight Dumais','Head Diving Coach','ddumais23@arizona.edu',1),
  ('arizona','Peter Richardson','Associate Head Coach','peterrichardson@email.arizona.edu',2),
  ('arizona','Amanda Beard','Assistant Coach',null,3),
  ('arizona','Jay Holmes','Assistant Coach',null,4),
  ('arizona','Lauren Sullivan','Assistant Coach / Assistant Recruiting Coordinator',null,5),
  ('arizona','Carmen Hernandez','Assistant Diving Coach',null,6),

  ('towson','Anthony Bruno','Head Coach','abruno@towson.edu',0),
  ('towson','Emilie Petit','Associate Head Coach','epetit@towson.edu',1),
  ('towson','Patrick Boyle','Assistant Coach / Recruiting Coordinator','patrickboyle@towson.edu',2),
  ('towson','Sergey Meshcherskiy','Diving Coach','smeshcherskiy@towson.edu',3),

  ('virginia','Todd DeSorbo','Head Coach',null,0),
  ('virginia','Tyler Fenwick','Senior Associate Head Coach',null,1),
  ('virginia','Gary Taylor','Associate Head Coach',null,2),
  ('virginia','Reed Fujan','Associate Head Coach',null,3),
  ('virginia','Courtney Caldwell','Assistant Coach',null,4),
  ('virginia','Margaret Zagrobelny','Assistant Coach',null,5),

  ('navy','Bill Roberts','Head Coach','robertsw@usna.edu',0),
  ('navy','Mark Liscinsky','Associate Head Coach','liscinsk@usna.edu',1),
  ('navy','Jake Brown','Assistant Swimming Coach','brownja@usna.edu',2),
  ('navy','Tim Fisher','Head Coach for Diving','tifisher@usna.edu',3),
  ('navy','Anne Schwemmer','Assistant Diving Coach','schwemmer@usna.edu',4),

  ('rider','Steve Fletcher','Head Coach','fletcher@rider.edu',0),
  ('rider','Shannon Daly','Associate Head Coach','sdaly@rider.edu',1),
  ('rider','Kristen Simms','Head Diving Coach','ksimms@rider.edu',2),
  ('rider','Chris Blair','Assistant Diving Coach','cblair@rider.edu',3),

  ('holy-cross','Kristy Jones','Director of Swimming & Diving','klmjones@holycross.edu',0),
  ('holy-cross','Wil Aybar','Diving Coach','waybar@holycross.edu',1),
  ('holy-cross','Kate Magill','Assistant Coach','kmagill@holycross.edu',2),
  ('holy-cross','Caleb Lambert','Assistant Coach','clambert@holycross.edu',3),

  ('bryant','Katie Cameron','Head Coach','kcameron@bryant.edu',0),
  ('bryant','Billy Gordon','Associate Head Swimming and Diving Coach / Coordinator of Recruiting and Pool Operations','hgordon1@bryant.edu',1),
  ('bryant','Aimee Bourassa','Assistant Coach','abourass@bryant.edu',2),
  ('bryant','Mary Ellen Clark','Diving Coach','mclark16@bryant.edu',3),
  ('bryant','Lettie Williams','Swimming and Diving Graduate Assistant','lwilliams7@bryant.edu',4),
  ('bryant','Matthew Abraham','Assistant Diving Coach','mabraham1@bryant.edu',5),

  ('colgate','Ed Pretre','Mark S. Randall Head Swimming and Diving Coach','epretre@colgate.edu',0),
  ('colgate','Kelsey Reagan','Assistant Swimming & Diving Coach','kreagan@colgate.edu',1),
  ('colgate','Jessica Kugelman','Diving Coach','jkugelman@colgate.edu',2),

  ('cornell','Wes Newman','The Philip H. Bartels ''71 Head Coach of Men''s Swimming','wjn3@cornell.edu',0),
  ('cornell','Michael Ross','The Richard W. Gilbert Diving Coach','mr2427@cornell.edu',1),
  ('cornell','Caleb Treadwell','Assistant Coach','ct696@cornell.edu',2),

  ('fairfield','Jake Lichter','Head Men''s and Women''s Swimming & Diving Coach','jlichter@fairfield.edu',0),
  ('fairfield','Devon O''Nalty','Head Diving Coach / Assistant Swim Coach','donalty@fairfield.edu',1),
  ('fairfield','Emma Brown','Assistant Swimming & Diving Coach','ebrown3@fairfield.edu',2),

  ('la-salle','Kerry Smith','Head Coach','smithka@lasalle.edu',0),
  ('la-salle','Ian Forlini','Diving Coach','forlini@lasalle.edu',1),
  ('la-salle','George Wade','Assistant Coach / Men''s Recruiting Coordinator',null,2),
  ('la-salle','Chris Gleason','Assistant Coach / Women''s Recruiting Coordinator',null,3),

  ('manhattan','Brian Hansbury','Head Coach, Swimming & Diving','jhansbury01@manhattan.edu',0),
  ('manhattan','Joe Brennan','Assistant Coach',null,1),

  ('canisius','Scott Vanderzell','Head Coach','vanderzs@canisius.edu',0),
  ('canisius','Samantha Palma','Assistant Coach','palmas@canisius.edu',1),
  ('canisius','Adriana Bolender','Head Diving Coach','bolende1@canisius.edu',2),
  ('canisius','Marissa Oakey','Assistant Coach','oakeym@canisius.edu',3),
  ('canisius','Carolyn Morse','Graduate Assistant Coach','morse8@canisius.edu',4),

  ('iona','Nick Cavataro','Head Coach','ncavataro@iona.edu',0),
  ('iona','Mauro Pacsi','Assistant Coach','mpacsi@iona.edu',1),
  ('iona','Maureen Ledden Arnold','Diving Coach','marnold@iona.edu',2),
  ('iona','Aidan Wilson','Assistant Coach','awilson@iona.edu',3),
  ('iona','Julia Moser','Assistant Coach','jmoser@iona.edu',4),

  ('marist','Anthony Randall','Head Coach','anthony.randall@marist.edu',0),
  ('marist','Kyle O''Neil','Assistant Coach','kyle.oneil@marist.edu',1),
  ('marist','Jim Billesimo','Assistant Coach','james.billesimo1@marist.edu',2),
  ('marist','Shelly Patton','Assistant Coach','shelly.patton@marist.edu',3),
  ('marist','Kait Caple','Head Diving Coach','kait.caple@marist.edu',4),

  ('saint-peters','Eric Dirvin','Assistant Coach',null,0),
  ('saint-peters','Kamila Pawka','Assistant Coach',null,1),

  ('monmouth','Hayley Masi','Head Coach','hmasi@monmouth.edu',0),
  ('monmouth','Steve Levine','Assistant Coach','slevine@monmouth.edu',1),
  ('monmouth','Julie Stankiewicz','Director of Aquatics / Assistant Coach','jstankie@monmouth.edu',2),
  ('monmouth','Cassandra Fostik','Volunteer Assistant Coach',null,3),

  ('njit','Ron Farina','Head Coach, Swimming & Diving','farina@njit.edu',0),
  ('njit','Shawn Bryan','Assistant Coach, Swimming','shawn.m.bryan@njit.edu',1),
  ('njit','Timothy Lynch','Assistant Coach, Diving','timothy.lynch@njit.edu',2),

  ('wagner','Colin Shannahan','Head Coach','colin.shannahan@wagner.edu',0),
  ('wagner','Dominic Tobin','Assistant Coach','dominic.tobin@wagner.edu',1),
  ('wagner','Maile Mora','Assistant Coach','maile.mora@wagner.edu',2),
  ('wagner','Ella Wagner','Assistant Coach','ella.wagner@wagner.edu',3),
  ('wagner','Griffen Schimmel','Volunteer Assistant Coach','g.schimmel@wagner.edu',4),

  ('st-bonaventure','Mike Smiechowski','Head Swimming and Diving Coach','msmiechowski@sbu.edu',0),
  ('st-bonaventure','Alejandra Fuentes','Head Diving Coach','amfuentes@sbu.edu',1),
  ('st-bonaventure','Mikaela Snayczuk','Assistant Swimming & Diving Coach','msnayczuk@sbu.edu',2)
) as v(slug, name, title, email, ord)
join public.ncaa_programs p on p.slug = v.slug
where not exists (select 1 from public.ncaa_coaches c where c.program_id = p.id);
