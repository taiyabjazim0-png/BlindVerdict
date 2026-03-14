from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.session import Base, SessionLocal, engine
from app.models.models import Lawyer, User
from app.routes.ai import router as ai_router
from app.routes.auth import router as auth_router
from app.routes.cases import router as cases_router
from app.routes.documents import router as documents_router
from app.routes.lawyers import router as lawyers_router
from app.routes.caselogs import router as caselogs_router
from app.routes.messages import router as messages_router
from app.routes.research import router as research_router
from app.routes.reviews import router as reviews_router
from app.utils.security import hash_password

app = FastAPI(title="BlindVerdict API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(ai_router)
app.include_router(lawyers_router)
app.include_router(cases_router)
app.include_router(documents_router)
app.include_router(research_router)
app.include_router(reviews_router)
app.include_router(caselogs_router)
app.include_router(messages_router)

SEED_LAWYERS = [
    {"name": "Aarav Menon", "email": "aarav.menon@blindverdict.dev", "bar_id": "BCI-2020-101", "spec": "Civil Litigation", "exp": 8, "rating": 4.8, "price": "₹25,000 - ₹60,000", "cases": 124, "city": "Kochi", "state": "Kerala", "bio": "Focused on resolving civil disputes with a practical, client-first strategy."},
    {"name": "Priya Sharma", "email": "priya.sharma@blindverdict.dev", "bar_id": "BCI-2018-042", "spec": "Family Law", "exp": 12, "rating": 4.9, "price": "₹20,000 - ₹50,000", "cases": 210, "city": "New Delhi", "state": "Delhi", "bio": "Compassionate family law specialist handling custody, divorce, and domestic matters."},
    {"name": "Rahul Gupta", "email": "rahul.gupta@blindverdict.dev", "bar_id": "BCI-2015-088", "spec": "Criminal Law", "exp": 15, "rating": 4.7, "price": "₹40,000 - ₹1,20,000", "cases": 340, "city": "Lucknow", "state": "Uttar Pradesh", "bio": "Seasoned criminal defense lawyer with a strong courtroom record."},
    {"name": "Ananya Iyer", "email": "ananya.iyer@blindverdict.dev", "bar_id": "BCI-2019-156", "spec": "Corporate Law", "exp": 6, "rating": 4.5, "price": "₹50,000 - ₹1,50,000", "cases": 78, "city": "Mumbai", "state": "Maharashtra", "bio": "Corporate counsel specializing in M&A, compliance, and startup advisory."},
    {"name": "Vikram Singh", "email": "vikram.singh@blindverdict.dev", "bar_id": "BCI-2012-033", "spec": "Property Law", "exp": 18, "rating": 4.6, "price": "₹30,000 - ₹80,000", "cases": 290, "city": "Chandigarh", "state": "Punjab", "bio": "Property and real estate expert with deep land title verification experience."},
    {"name": "Meera Nair", "email": "meera.nair@blindverdict.dev", "bar_id": "BCI-2021-201", "spec": "Labour Law", "exp": 4, "rating": 4.3, "price": "₹8,000 - ₹25,000", "cases": 42, "city": "Thiruvananthapuram", "state": "Kerala", "bio": "Labour law advocate focusing on employee rights and workplace disputes."},
    {"name": "Sanjay Patel", "email": "sanjay.patel@blindverdict.dev", "bar_id": "BCI-2016-077", "spec": "Taxation", "exp": 10, "rating": 4.4, "price": "₹30,000 - ₹90,000", "cases": 155, "city": "Ahmedabad", "state": "Gujarat", "bio": "Tax litigation specialist with experience in GST, income tax, and tribunal cases."},
    {"name": "Kavitha Reddy", "email": "kavitha.reddy@blindverdict.dev", "bar_id": "BCI-2017-119", "spec": "Criminal Law", "exp": 9, "rating": 4.6, "price": "₹25,000 - ₹75,000", "cases": 180, "city": "Hyderabad", "state": "Telangana", "bio": "Criminal law practitioner with expertise in white-collar crime and bail matters."},
    {"name": "Arjun Deshmukh", "email": "arjun.deshmukh@blindverdict.dev", "bar_id": "BCI-2014-065", "spec": "Civil Litigation", "exp": 14, "rating": 4.7, "price": "₹20,000 - ₹65,000", "cases": 260, "city": "Pune", "state": "Maharashtra", "bio": "Civil litigation expert handling contract disputes and injunctions."},
    {"name": "Deepa Krishnan", "email": "deepa.krishnan@blindverdict.dev", "bar_id": "BCI-2020-188", "spec": "Family Law", "exp": 5, "rating": 4.5, "price": "₹10,000 - ₹35,000", "cases": 65, "city": "Chennai", "state": "Tamil Nadu", "bio": "Family law advocate with sensitivity toward child welfare and mediation."},
    {"name": "Rohit Verma", "email": "rohit.verma@blindverdict.dev", "bar_id": "BCI-2013-044", "spec": "Property Law", "exp": 16, "rating": 4.8, "price": "₹35,000 - ₹1,00,000", "cases": 310, "city": "Gurugram", "state": "Haryana", "bio": "Property dispute resolution expert across urban and rural matters."},
    {"name": "Shreya Banerjee", "email": "shreya.banerjee@blindverdict.dev", "bar_id": "BCI-2019-132", "spec": "Corporate Law", "exp": 7, "rating": 4.4, "price": "₹40,000 - ₹1,20,000", "cases": 92, "city": "Kolkata", "state": "West Bengal", "bio": "Corporate and commercial law advisor handling due diligence and contracts."},
    {"name": "Aditya Joshi", "email": "aditya.joshi@blindverdict.dev", "bar_id": "BCI-2011-021", "spec": "Criminal Law", "exp": 20, "rating": 4.9, "price": "₹75,000 - ₹2,50,000", "cases": 480, "city": "New Delhi", "state": "Delhi", "bio": "Senior criminal lawyer with Supreme Court practice and landmark case experience."},
    {"name": "Neelam Chauhan", "email": "neelam.chauhan@blindverdict.dev", "bar_id": "BCI-2022-210", "spec": "Labour Law", "exp": 3, "rating": 4.2, "price": "₹5,000 - ₹20,000", "cases": 28, "city": "Jaipur", "state": "Rajasthan", "bio": "Emerging labour law practitioner focusing on gig economy and contract workers."},
    {"name": "Suresh Rao", "email": "suresh.rao@blindverdict.dev", "bar_id": "BCI-2016-098", "spec": "Taxation", "exp": 11, "rating": 4.5, "price": "₹25,000 - ₹80,000", "cases": 170, "city": "Bengaluru", "state": "Karnataka", "bio": "Taxation expert handling transfer pricing, international tax, and appeals."},
    {"name": "Pooja Malhotra", "email": "pooja.malhotra@blindverdict.dev", "bar_id": "BCI-2018-167", "spec": "Family Law", "exp": 8, "rating": 4.7, "price": "₹15,000 - ₹45,000", "cases": 140, "city": "Noida", "state": "Uttar Pradesh", "bio": "Family law specialist experienced in cross-border custody and NRI divorces."},
    {"name": "Karthik Sundaram", "email": "karthik.sundaram@blindverdict.dev", "bar_id": "BCI-2015-054", "spec": "Civil Litigation", "exp": 13, "rating": 4.6, "price": "₹20,000 - ₹55,000", "cases": 230, "city": "Coimbatore", "state": "Tamil Nadu", "bio": "Consumer and civil dispute resolution with a mediation-first approach."},
    {"name": "Ritika Saxena", "email": "ritika.saxena@blindverdict.dev", "bar_id": "BCI-2020-175", "spec": "Corporate Law", "exp": 5, "rating": 4.3, "price": "₹35,000 - ₹1,00,000", "cases": 55, "city": "Bengaluru", "state": "Karnataka", "bio": "Startup and venture capital focused corporate counsel."},
    {"name": "Manish Tiwari", "email": "manish.tiwari@blindverdict.dev", "bar_id": "BCI-2017-082", "spec": "Property Law", "exp": 10, "rating": 4.5, "price": "₹18,000 - ₹50,000", "cases": 185, "city": "Bhopal", "state": "Madhya Pradesh", "bio": "Land acquisition and real estate regulation specialist."},
    {"name": "Swati Kulkarni", "email": "swati.kulkarni@blindverdict.dev", "bar_id": "BCI-2021-195", "spec": "Criminal Law", "exp": 4, "rating": 4.3, "price": "₹12,000 - ₹40,000", "cases": 38, "city": "Pune", "state": "Maharashtra", "bio": "Criminal defense advocate with focus on cybercrime and digital evidence."},
]


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for lawyer_data in SEED_LAWYERS:
            existing = db.query(User).filter(User.email == lawyer_data["email"]).first()
            if existing:
                lawyer = db.query(Lawyer).filter(Lawyer.user_id == existing.id).first()
                if lawyer:
                    lawyer.price_range = lawyer_data["price"]
                    lawyer.city = lawyer_data["city"]
                    lawyer.state = lawyer_data["state"]
                continue
            user = User(
                name=lawyer_data["name"],
                email=lawyer_data["email"],
                password_hash=hash_password("password123"),
                role="Lawyer",
            )
            db.add(user)
            db.flush()
            db.add(
                Lawyer(
                    user_id=user.id,
                    bar_id=lawyer_data["bar_id"],
                    specialization=lawyer_data["spec"],
                    experience_years=lawyer_data["exp"],
                    rating=lawyer_data["rating"],
                    bio=lawyer_data["bio"],
                    price_range=lawyer_data["price"],
                    cases_handled=lawyer_data["cases"],
                    city=lawyer_data["city"],
                    state=lawyer_data["state"],
                )
            )
        db.commit()
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok"}
