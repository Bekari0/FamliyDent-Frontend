
import json
import random
from datetime import datetime, timedelta

def generate_analytics():
    """Симуляция анализа данных клиники для отчетности."""
    stats = {
        "total_patients": random.randint(1000, 5000),
        "total_bookings": random.randint(5000, 10000),
        "revenue_growth": round(random.uniform(5.5, 15.2), 2),
        "top_services": [
            {"name": "Лечение кариеса", "count": 450},
            {"name": "Гигиена", "count": 320},
            {"name": "Имплантация", "count": 120}
        ],
        "doctor_performance": [
            {"name": "Др. Ахмедов", "efficiency": 98},
            {"name": "Др. Саидова", "efficiency": 95}
        ],
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    with open('public/analytics_report.json', 'w', encoding='utf-8') as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
    
    print("Report generated successfully.")

if __name__ == "__main__":
    generate_analytics()
