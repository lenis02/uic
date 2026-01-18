import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoryService implements OnModuleInit {
  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,
  ) {}

  // [1] 서버 시작 시 자동 실행되는 함수
  async onModuleInit() {
    await this.seedData();
  }

  // [2] 초기 데이터 복구 로직 (Seeding)
  async seedData() {
    // 이미 데이터가 있다면 아무것도 하지 않음 (중복 방지)
    const count = await this.historyRepository.count();
    if (count > 0) {
      console.log('✅ 연혁 데이터가 이미 존재합니다. (Seeding 건너뜀)');
      return;
    }

    console.log('⚡ 연혁 데이터가 비어있어 초기 데이터를 복구합니다...');

    // 제공해주신 원본 데이터 (ID는 자동 생성이므로 제외하고 내용만 넣음)
    const initialHistories = [
      {
        year: '2020',
        date: '06.01',
        title:
          'UIC X 유안타증권 실전투자대회 (주최-전국 대학생 투자동아리 연합회/주관-유안타증권)',
      },
      {
        year: '2020',
        date: '08.13',
        title: '한국증권인재개발원 상호지원을 위한 MOU 체결',
      },
      { year: '2020', date: '08.22', title: '제9회 투자콘서트 개최' },
      {
        year: '2020',
        date: '12.14',
        title:
          'UIC X 유안타증권 모의투자대회 (주최-전국 대학생 투자동아리 연합회/주관-유안타증권)',
      },
      {
        year: '2020',
        date: '12.19',
        title: '금융권 직무 토크쇼 (주관 - UIC X CFA Society Korea)',
      },
      {
        year: '2019',
        date: '05.18',
        title: '금융권 직무 토크쇼 (주관 - UIC X CFA Society Korea)',
      },
      {
        year: '2019',
        date: '05.09',
        title:
          'UIC X 유안타증권 실전투자대회 (주최-전국 대학생 투자동아리 연합회/주관-유안타증권)',
      },
      {
        year: '2019',
        date: '08.13',
        title: '한국증권인재개발원 상호지원을 위한 MOU 체결',
      },
      { year: '2019', date: '08.24', title: '제8회 투자콘서트 개최' },
      {
        year: '2019',
        date: '11.24',
        title: '헤지펀드 콘서트 (주관 - 금융투자협회)',
      },
      {
        year: '2018',
        date: '05.26',
        title: '금융권 직무 토크쇼 (주관 - UIC X CFA Society Korea)',
      },
      {
        year: '2018',
        date: '06.25',
        title: '핀업스탁 상호지원을 위한 MOU 체결',
      },
      { year: '2018', date: '08.25', title: '제7회 투자콘서트 개최' },
      {
        year: '2018',
        date: '11.25',
        title: '헤지펀드 콘서트 (주관 - 금융투자협회)',
      },
      {
        year: '2017',
        date: '03.15',
        title: '이리온 공개방송 강연 참가제휴 (주관 - 이베스트투자증권)',
      },
      {
        year: '2017',
        date: '07.29',
        title: 'UIC 워크샵 진행 (공동주관 - UIC X 전국투자자교육협의회)',
      },
      {
        year: '2017',
        date: '08.31',
        title: '한국투자증권 상호지원을 위한 MOU 체결',
      },
      { year: '2017', date: '09.09', title: '제6회 투자콘서트 개최' },
      {
        year: '2017',
        date: '10.14',
        title: '헤지펀드 콘서트 참가제휴 (주관 - 금융투자협회)',
      },
      {
        year: '2016',
        date: '03.30',
        title: '2016 메트로 100세플러스 포럼 참가제휴 (주관 - 메트로신문)',
      },
      { year: '2016', date: '08.20', title: '제5회 투자콘서트 개최' },
      {
        year: '2016',
        date: '10.04',
        title:
          'UIC X 유안타증권 모의투자대회 (주최-전국 대학생 투자동아리 연합회/주관-유안타증권)',
      },
      {
        year: '2015',
        date: '04.27',
        title: '증권플러스 인사이트 필진 연계 (주관-두나무_증권플러스)',
      },
      {
        year: '2015',
        date: '05.01',
        title:
          '금융 교육 장학생 ‘이패스 프렌즈’ (주최-전국 대학생 투자동아리 연합회/주관-이패스코리아)',
      },
      { year: '2015', date: '08.22', title: '제4회 투자콘서트 개최' },
      {
        year: '2015',
        date: '12.04',
        title: '2016 대한민국 재테크 박람회 서포터즈 (주최-조선일보 외)',
      },
      { year: '2014', date: '06.10', title: '글로벌 자산배분 포럼 참가제휴' },
      {
        year: '2014',
        date: '07.01',
        title: '펀드온라인코리아(주) 업무협약 체결',
      },
      { year: '2014', date: '08.30', title: '제3회 투자콘서트 개최' },
      {
        year: '2013',
        date: '03.25~06.07',
        title: 'UIC&키움증권 차세대 HTS 모니터링 보고서 공모전',
      },
      {
        year: '2013',
        date: '06.11~06.12',
        title: '세계전략포럼2013 참가 제휴',
      },
      {
        year: '2013',
        date: '06.22',
        title: 'CFA Career Development and Networking Seminar',
      },
      { year: '2013', date: '08.31', title: '제2회 투자콘서트 개최' },
      {
        year: '2012',
        date: '03.17',
        title: '전국 대학생 투자동아리 연합회 Research Book 발간',
      },
      { year: '2012', date: '03.29', title: '2012 국제금융컨퍼런스 참석 제휴' },
      {
        year: '2012',
        date: '03.26~04.27',
        title:
          '삼성증권배 UIC 모의투자대 (주최-삼성증권/주관-전국 대학생 투자동아리 연합회)',
      },
      {
        year: '2012',
        date: '07.29~09.08',
        title:
          '제1회 ALL바른 투자콘서트 개최 (주최-전국 대학생 투자동아리 연합회/주관-삼성증권/후원-크레듀, Bloomberg)',
      },
      {
        year: '2011',
        date: '01.21',
        title:
          '제1회 전국 투자 동아리 리서치 대회 (주최-전국 대학생 투자동아리 연합회/주관-KTB증권)',
      },
      {
        year: '2011',
        date: '02.26',
        title:
          '키움증권 Valuation 강의 (주최-전국 대학생 투자동아리 연합회/주관-키움증권)',
      },
      {
        year: '2011',
        date: '04.04~08.05',
        title:
          '제2회 이데일리 챔피언스리그 실전투자대회 (주최-전국 대학생 투자동아리 연합회/주관-이데일리)',
      },
      {
        year: '2011',
        date: '07.19',
        title:
          '동부증권 투자설명회 (주최-전국 대학생 투자동아리 연합회/주관-동부증권)',
      },
      {
        year: '2011',
        date: '09~11.30',
        title:
          '대학생 주식아카데미 ‘Stock Master’ (주최-전국 대학생 투자동아리 연합회/주관-한국주식가치평가원)',
      },
      {
        year: '2010',
        date: '05.08~06.30',
        title:
          '제1차 키움증권 Valuation 강의 (주최-전국 대학생 투자동아리 연합회/주관-키움증권)',
      },
      {
        year: '2010',
        date: '07.06~07.07',
        title:
          '제5회 대학생 금융투자캠프 참가 (주관-전국 대학생 투자동아리 연합회)',
      },
      {
        year: '2009',
        date: '05.01~06',
        title:
          '키움증권 UCC 애널리스트 선발대회 (주최-전국 대학생 투자동아리 연합회/주관-키움증권)',
      },
      {
        year: '2009',
        date: '05.16',
        title:
          '키움증권 대학생 심포지엄 (주최-전국 대학생 투자동아리 연합회/주관-키움증권)',
      },
      {
        year: '2008',
        date: '02.25~12.19',
        title:
          '도전 캠퍼스 주식왕-실전투자대회 - 25개 대학 참가 (주최-전국 대학생 투자동아리 연합회/주관-한국경제TV/후원-CJ증권)',
      },
      {
        year: '2008',
        date: '08.23',
        title:
          '제2회 전국 대학생 투자동아리 연합회 연합포럼 (주최-전국 대학생 투자동아리 연합회/후원-굿모닝 신한증권)',
      },
      {
        year: '2008',
        date: '12.22~01.23',
        title:
          '제1회 현대증권 여대생 모의투자대회 (주최-전국 대학생 투자동아리 연합회/주관-현대증권)',
      },
      {
        year: '2007',
        date: '05.24',
        title:
          '제1회 한경 대학생 증권동아리 포럼 (주최-전국 대학생 투자동아리 연합회)',
      },
      {
        year: '2007',
        date: '10.01~03.28',
        title:
          '한경 대학생 동아리 모의투자대회 - 30개 대학 참가 (주최-전국 대학생 투자동아리 연합회/주관-한국경제)',
      },
      {
        year: '2006',
        date: '08.18',
        title: '대학생 투자동아리 연합발족, 연합세션 (12개 학교 참가)',
      },
    ];

    // DB에 일괄 저장
    await this.historyRepository.save(initialHistories);
    console.log(`✅ 총 ${initialHistories.length}개의 연혁 데이터 복구 완료!`);
  }

  // 전체 조회 (최신 연도순, 같은 연도 내에서는 최신 날짜순)
  async findAll() {
    return await this.historyRepository.find({
      order: {
        year: 'DESC',
        date: 'DESC',
      },
    });
  }

  // 연혁 추가 (관리자 전용)
  async create(createHistoryDto: CreateHistoryDto) {
    const history = this.historyRepository.create(createHistoryDto);
    return await this.historyRepository.save(history);
  }

  // 연혁 삭제 (관리자 전용)
  async remove(id: number) {
    const result = await this.historyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ID ${id}인 연혁을 찾을 수 없습니다.`);
    }
    return { message: '삭제되었습니다.' };
  }
}
